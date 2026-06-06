# ElevenLabs Onboarding Voice Agent

This document describes how to configure an **ElevenLabs Conversational AI**
agent to complete the NGO onboarding by voice, writing into the same
structured profile as the text chat.

> **Status:** Contract + endpoints + UI hook are implemented. The voice agent
> itself requires ElevenLabs credentials and manual configuration in the
> ElevenLabs dashboard. The **text fallback is always functional** — voice is
> additive, never required.

---

## Architecture

```
┌──────────────┐   voice    ┌─────────────────────┐   tool calls (HTTPS)
│   NGO user   │ ─────────► │  ElevenLabs ConvAI  │ ──────────────────────┐
└──────────────┘            │       agent         │                       │
       ▲                    └─────────────────────┘                       ▼
       │ widget (browser)            │                      ┌──────────────────────────┐
       │ dynamic var: session_id     │  Bearer token        │  /api/onboarding/voice/* │
┌──────┴───────────────┐             └────────────────────► │  (Next.js route handlers)│
│ /onboarding (Next.js)│                                     └──────────────┬───────────┘
└──────────────────────┘                                                    │
                                                                            ▼
                                                          ┌─────────────────────────────┐
                                                          │ Onboarding store (Redis /    │
                                                          │ in-memory) — SAME session    │
                                                          │ as the text chat             │
                                                          └─────────────────────────────┘
```

The browser widget passes `session_id` as a **dynamic variable**, so the voice
agent operates on the same `OnboardingSession` the text chat created. Every
tool call is authenticated with a server bearer token.

---

## Environment variables

See [ENVIRONMENT.md](./ENVIRONMENT.md). The relevant ones:

```env
ELEVENLABS_API_KEY=                  # server-side ElevenLabs key
ELEVENLABS_AGENT_ID=                 # server reference
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=     # public id used by the browser widget
ONBOARDING_AGENT_SERVICE_TOKEN=      # Bearer token the agent must send
NEXT_PUBLIC_ONBOARDING_VOICE_ENABLED=true
```

If `ONBOARDING_AGENT_SERVICE_TOKEN` is **unset**, all `/api/onboarding/voice/*`
endpoints fail closed (HTTP 503).

---

## Endpoints (all require `Authorization: Bearer <ONBOARDING_AGENT_SERVICE_TOKEN>`)

| Tool                         | Endpoint (split)                          | Unified dispatcher                       |
| ---------------------------- | ----------------------------------------- | ---------------------------------------- |
| `get_onboarding_state`       | `POST /api/onboarding/voice/state`        | `POST /api/onboarding/voice/tool`        |
| `save_onboarding_answer`     | `POST /api/onboarding/voice/save-answer`  | `POST /api/onboarding/voice/tool`        |
| `update_onboarding_profile`  | `POST /api/onboarding/voice/update-profile` | `POST /api/onboarding/voice/tool`      |
| `mark_onboarding_complete`   | `POST /api/onboarding/voice/complete`     | `POST /api/onboarding/voice/tool`        |

The **unified dispatcher** accepts `{ "tool": "<name>", "args": { ... } }` —
convenient if you prefer to configure a single webhook tool in ElevenLabs.

### Tool schemas

```ts
get_onboarding_state({ sessionId: string })

save_onboarding_answer({
  sessionId: string;
  questionKey: string;      // one of the stable keys (see questions.ts)
  answer: string;
  confidence?: "low" | "medium" | "high";
})

update_onboarding_profile({
  sessionId: string;
  patch: Partial<NgoOnboardingProfile>;
})

mark_onboarding_complete({ sessionId: string; force?: boolean })
```

All return the current state snapshot:
`{ sessionId, status, currentQuestionKey, completedBlocks, missingFields, confidence, profile }`.

### Question keys

The stable `questionKey` values live in
[`lib/onboarding/questions.ts`](../lib/onboarding/questions.ts). Examples:
`org_name`, `org_one_liner`, `org_cause`, `org_beneficiaries`, `programs`,
`fundraising_methods`, `fundraising_challenge`, `channels`, `campaign_need`,
`store_products`, `street_objections`, `preferred_tone`, `ops_digital_maturity`.

---

## Configuring the ElevenLabs agent

1. Create a Conversational AI agent in the ElevenLabs dashboard.
2. Paste the **system prompt** below.
3. Register the 4 tools as **Server Tools (webhooks)** pointing at the endpoints
   above, each with header `Authorization: Bearer <ONBOARDING_AGENT_SERVICE_TOKEN>`.
4. Declare a dynamic variable `session_id` (provided by the widget).
5. Copy the agent id into `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` and set
   `NEXT_PUBLIC_ONBOARDING_VOICE_ENABLED=true`.

### System prompt

```text
Sos el agente de onboarding de una plataforma para ONGs de Argentina y LatAm.

Tu tarea es entrevistar a una organización social para entender quiénes son, qué hacen, cómo recaudan fondos y qué activos necesitan generar para mejorar su recaudación.

No sos un vendedor. No sos un bot de soporte. Sos un facilitador que ayuda a ordenar información.

Objetivo de la llamada:
Completar un perfil estructurado de la ONG para que luego la plataforma pueda generar:
- una landing de crowdfunding,
- una tienda solidaria,
- una guía para captadores de donaciones,
- mensajes y materiales de comunicación.

Variables dinámicas:
- session_id
- organization_name, si existe
- current_question_key
- onboarding_progress
- known_profile_summary

Tools disponibles:
1. get_onboarding_state(session_id)
2. save_onboarding_answer(session_id, question_key, answer, confidence)
3. update_onboarding_profile(session_id, patch)
4. mark_onboarding_complete(session_id)

Reglas:
- Hacé una pregunta por vez.
- Usá español rioplatense neutro, claro y humano.
- No uses jerga técnica.
- Si la persona no sabe, permití saltar.
- No inventes números de impacto.
- No exageres resultados.
- No prometas que van a recaudar más dinero.
- No pidas datos bancarios, tarjetas, contraseñas ni información sensible innecesaria.
- Si aparecen datos sensibles, resumilos de forma general.
- Confirmá cada bloque con un resumen corto.
- Llamá save_onboarding_answer después de cada respuesta útil.
- Llamá update_onboarding_profile cuando puedas estructurar información nueva.
- Llamá mark_onboarding_complete solo cuando estén cubiertos los bloques mínimos.

Bloques mínimos:
1. Identidad de la ONG.
2. Causa y beneficiarios.
3. Programas principales.
4. Recaudación actual.
5. Canales de comunicación.
6. Campaña o necesidad prioritaria.
7. Posibles productos o donaciones simbólicas.
8. Captación en calle y objeciones frecuentes.
9. Capacidad operativa del equipo.

Cierre:
Cuando termines, decí:
"Perfecto. Ya tengo una primera versión del perfil de la organización. Ahora pueden revisarlo en la plataforma y usarlo para generar su kit de recaudación."
```

---

## Security notes

- All voice endpoints require the bearer token and **fail closed** when the
  token is not configured.
- The token comparison is constant-time (`lib/onboarding/auth.ts`).
- Tool inputs are validated server-side (unknown `questionKey` is rejected;
  completion is gated by the minimum blocks unless `force: true`).
- **TODO(prod):** add rate limiting and per-session ownership checks before
  exposing publicly.
```
