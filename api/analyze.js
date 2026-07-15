// api/analyze.js — Funzione serverless (Vercel)
// Riceve una foto in base64, chiama l'API Anthropic e restituisce
// l'inventario mobili in JSON. La chiave API resta sul server.

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY non configurata su Vercel" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const image = body && body.image;
  const mediaType = (body && body.mediaType) || "image/jpeg";
  if (!image) {
    return res.status(400).json({ error: "Nessuna immagine ricevuta" });
  }

  const prompt = `Sei un perito traslochi. Identifica in questa foto i SINGOLI mobili, elettrodomestici e oggetti voluminosi da traslocare. Stima il volume in m³ di CIASCUN pezzo con cubature realistiche da professionista (armadio 3 ante ~1.8, divano 3 posti ~1.5, lavatrice ~0.4, sedia ~0.15, scatola ~0.1).
Rispondi SOLO con JSON valido compatto, senza backtick né altro testo:
{"n":"nome stanza","m":[["nome mobile",quantita,volume_m3_per_pezzo]],"c":"alta|media|bassa"}`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mediaType, data: image },
              },
              { type: "text", text: prompt },
            ],
          },
        ],
      }),
    });

    const raw = await r.text();
    if (!r.ok) {
      return res.status(r.status).json({ error: "Anthropic " + r.status + ": " + raw.slice(0, 200) });
    }

    const data = JSON.parse(raw);
    const text = (data.content || [])
      .filter(function (b) { return b.type === "text"; })
      .map(function (b) { return b.text; })
      .join("\n");

    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: "Analisi fallita: " + err.message });
  }
};
