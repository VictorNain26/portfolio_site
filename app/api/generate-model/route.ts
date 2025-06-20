import { NextResponse } from 'next/server'
export async function POST(req: Request) {
  const { prompt } = (await req.json()) as { prompt?: string }
  if (!prompt) {
    return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })
  }

  const endpoint =
    'https://api-inference.huggingface.co/models/openai/shap-e'

  /* -------- 1️⃣ Appel + boucle d’attente si le modèle “warm-up” ------ */
  let res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/*',
    },
    body: JSON.stringify({ inputs: prompt }),
  })

  // Hugging Face renvoie 503 si le modèle n’est pas prêt ; on re-essaie
  while (res.status === 503) {
    await new Promise((r) => setTimeout(r, 3000))
    res = await fetch(res.url!, { headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` } })
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: await res.text() },
      { status: res.status },
    )
  }

  /* -------- 2️⃣ On renvoie le binaire directement -------------------- */
  const arrayBuffer = await res.arrayBuffer()
  const contentType =
    res.headers.get('content-type') ??
    'application/octet-stream'          // .glb ou .zip

  return new NextResponse(arrayBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      // permet au navigateur de télécharger en flux
      'Content-Disposition': `inline; filename="model.${contentType.includes('zip') ? 'zip' : 'glb'}`,
    },
  })
}
