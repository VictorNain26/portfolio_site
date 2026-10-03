import { describe, expect, it } from 'vitest';
import { withoutInvitations } from './judge';

describe('withoutInvitations', () => {
  it('drops the invitation to write that the agent is told to give', () => {
    expect(
      withoutInvitations([
        'le plus simple est de lui écrire',
        'écrire à Victor',
        'écrire à Victor Lenain.',
      ]),
    ).toEqual([]);
  });

  it('keeps a real promise, even one about writing', () => {
    const promises = [
      'je lui transmets ta question et il te répondra par mail',
      "Je peux demander à Victor de t'envoyer un accès à la bêta.",
      'je lui écrirai pour toi',
    ];
    expect(withoutInvitations(promises)).toEqual(promises);
  });
});
