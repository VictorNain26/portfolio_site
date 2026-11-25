import { useChat } from '@ai-sdk/react';
import { APICallError, DefaultChatTransport, generateId } from 'ai';
import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { MAX_QUESTION, textOf, type AskMessage, type Quota } from '../lib/agent/messages';

// The thread lives in this tab only, so it survives a visit to another page and back.
const STORE = 'ask-thread';
type Saved = { id: string; messages: AskMessage[]; status?: string; exhaustedUntil?: number };

const load = (): Saved => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE) ?? '') as Saved;
    if (typeof saved.id === 'string' && Array.isArray(saved.messages)) return saved;
  } catch {
    // Nothing stored, or storage refused (private window).
  }
  return { id: generateId(), messages: [] };
};
const save = (saved: Saved) => {
  try {
    sessionStorage.setItem(STORE, JSON.stringify(saved));
  } catch {
    // Storage refused: the thread just won't outlive the page.
  }
};

const errors: Record<string, string> = {
  limit: 'Tu as posé tes dix questions du jour. Reviens demain, ou écris-moi.',
  global_limit: "L'assistant a assez parlé pour aujourd'hui. Reviens demain, ou écris-moi.",
  failed: "L'assistant n'a pas pu répondre. Réessaie dans un moment.",
};

// /api/ask answers a refusal with JSON ({ code, reset }); the transport hands it back as an
// APICallError whose body is that JSON.
const refusal = (error: Error | undefined): { code: string; reset?: number } | undefined => {
  if (!error) return undefined;
  if (APICallError.isInstance(error) && error.responseBody) {
    try {
      return JSON.parse(error.responseBody) as { code: string; reset?: number };
    } catch {
      // Not ours: a proxy or Vercel answered.
    }
  }
  return { code: 'failed' };
};

const remainingText = ({ remaining }: Quota) =>
  remaining === 0
    ? "C'était ta dernière question pour aujourd'hui."
    : `Encore ${remaining} question${remaining > 1 ? 's' : ''} aujourd'hui.`;

export default function Ask() {
  const [initial] = useState(load);
  const [chatId, setChatId] = useState(initial.id);
  const [open, setOpen] = useState(initial.messages.length > 0);
  const [status, setStatus] = useState(initial.status ?? '');
  const [exhaustedUntil, setExhaustedUntil] = useState(initial.exhaustedUntil);
  const [question, setQuestion] = useState('');
  const [stopped, setStopped] = useState(false);
  // Turns restored from the tab arrive without the entrance animation.
  const [restored, setRestored] = useState(initial.messages.length / 2);
  const input = useRef<HTMLInputElement>(null);
  const exhausted = exhaustedUntil !== undefined && Date.now() < exhaustedUntil;

  const chat = useChat<AskMessage>({
    id: chatId,
    messages: chatId === initial.id ? initial.messages : [],
    // The server keeps the conversation: only the new question and the chat id go up.
    // https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-message-persistence
    transport: new DefaultChatTransport({
      api: '/api/ask',
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: { id, message: messages.at(-1) },
      }),
    }),
    onData: part => {
      if (part.type !== 'data-quota') return;
      setStatus(remainingText(part.data));
      if (part.data.remaining === 0) setExhaustedUntil(part.data.reset);
    },
  });
  const busy = chat.status === 'submitted' || chat.status === 'streaming';
  const failure = refusal(chat.error);

  useEffect(() => {
    if (failure?.reset && (failure.code === 'limit' || failure.code === 'global_limit'))
      setExhaustedUntil(failure.reset);
  }, [failure?.code, failure?.reset]);

  // Nothing was answered: give the question back so it can be sent again.
  useEffect(() => {
    if (chat.status !== 'error' || exhausted) return;
    const asked = chat.messages.findLast(message => message.role === 'user');
    const answer = chat.messages.at(-1);
    if (asked && (answer === asked || !textOf(answer!))) setQuestion(textOf(asked));
  }, [chat.status]);

  useEffect(() => {
    if (busy) return;
    save({
      id: chatId,
      messages: chat.messages,
      status,
      ...(exhausted && { exhaustedUntil }),
    });
  }, [busy, chatId, chat.messages, status, exhausted, exhaustedUntil]);

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) {
      setStopped(true);
      void chat.stop();
      return;
    }
    const text = question.trim();
    if (!text || exhausted) return;
    chat.clearError();
    setStopped(false);
    setStatus('');
    setQuestion('');
    void chat.sendMessage({ text });
  };

  const reset = () => {
    void chat.stop();
    setRestored(0);
    setStopped(false);
    setChatId(generateId());
    setStatus(exhausted ? status : '');
    input.current?.focus({ preventScroll: true });
  };

  const toggle = () => {
    setOpen(!open);
    // Wait for the panel to unfold before moving focus into it.
    if (!open && !exhausted) setTimeout(() => input.current?.focus({ preventScroll: true }), 250);
  };

  const turns = chat.messages.flatMap((message, i) =>
    message.role === 'user' ? [{ question: message, answer: chat.messages[i + 1] }] : [],
  );
  const last = turns.length - 1;

  return (
    <>
      <button
        className="toggle"
        type="button"
        aria-expanded={open}
        aria-controls="ask-panel"
        onClick={toggle}
      >
        <span className="title-text">Une question sur mon travail ?</span>
        <span className="count">{open ? 'Fermer' : 'Demander'}</span>
      </button>
      <div className={open ? 'unfold open' : 'unfold'} id="ask-panel">
        <div className="panel" inert={!open}>
          <p className="hint">Mon assistant IA y répond, jusqu'à dix par jour.</p>
          {turns.length > 0 && (
            <ol className="thread" aria-live="polite" aria-busy={busy}>
              {turns.map(({ question: asked, answer }, i) => {
                const sources =
                  answer?.parts.flatMap(part => (part.type === 'source-url' ? [part] : [])) ?? [];
                const answering = i === last && busy;
                return (
                  <li key={asked.id} className={i >= restored ? 'turn arrive' : 'turn'}>
                    <p className="who">Toi</p>
                    <p className="question">{textOf(asked)}</p>
                    <p className="who">L'assistant</p>
                    {answer && textOf(answer) ? (
                      <p className="answer">{textOf(answer)}</p>
                    ) : answering ? (
                      <span className="dots">
                        <span className="sr-only">L'assistant réfléchit</span>
                        <i />
                        <i />
                        <i />
                      </span>
                    ) : null}
                    {sources.length > 0 && (
                      <ul className="sources">
                        {sources.map(source => (
                          <li key={source.sourceId}>
                            <a className="link" href={source.url} target="_blank" rel="noopener">
                              {source.title ?? source.url}
                              <span className="sr-only"> (nouvel onglet)</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                    {i === last && !busy && chat.status === 'error' && (
                      <p className="note">
                        {errors[failure?.code ?? 'failed'] ?? errors['failed']}
                      </p>
                    )}
                    {i === last && !busy && stopped && <p className="note">Réponse arrêtée.</p>}
                  </li>
                );
              })}
            </ol>
          )}
          <form className="field" onSubmit={submit}>
            <label className="sr-only" htmlFor="ask-input">
              Ta question pour mon assistant
            </label>
            <input
              ref={input}
              id="ask-input"
              name="question"
              type="text"
              maxLength={MAX_QUESTION}
              required={!busy}
              autoComplete="off"
              enterKeyHint="send"
              placeholder="Sur quoi Victor travaille en ce moment ?"
              value={question}
              onChange={event => setQuestion(event.target.value)}
              disabled={busy || exhausted}
            />
            <button type="submit" disabled={exhausted && !busy}>
              {busy ? 'Arrêter' : 'Envoyer'}
            </button>
          </form>
          <div className="meta-line">
            {status && (
              <p className="status" role="status">
                {status}
              </p>
            )}
            {turns.length > 0 && (
              <button type="button" className="reset" onClick={reset}>
                Nouvelle conversation
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
