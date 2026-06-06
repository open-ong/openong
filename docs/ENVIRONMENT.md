# Environment variables

> The repo's `.gitignore` ignores `.env*`, so this file documents the variables
> instead of shipping a `.env.example`. Copy the block below into `.env.local`.

```env
# ─────────────────────────────────────────────────────────────
# Existing app (Vercel Platforms starter)
# ─────────────────────────────────────────────────────────────
# Upstash Redis — used by subdomains, pages AND onboarding sessions.
# If unset, the onboarding feature falls back to an in-memory store
# (per-process, non-durable) so local/demo still works.
KV_REST_API_URL=
KV_REST_API_TOKEN=

# Root domain for multi-tenant subdomains (defaults to localhost:3000).
NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000

# ─────────────────────────────────────────────────────────────
# Onboarding text agent (OPTIONAL)
# ─────────────────────────────────────────────────────────────
# If NEITHER key is set, the text agent runs in deterministic mode
# (scripted interview) — no external calls, always works.
# Anthropic is preferred when both are present.
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
# Override the model used by whichever provider is active.
# Defaults: claude-sonnet-4-6 (Anthropic) / gpt-4o-mini (OpenAI).
ONBOARDING_LLM_MODEL=

# ─────────────────────────────────────────────────────────────
# ElevenLabs voice onboarding agent (OPTIONAL)
# ─────────────────────────────────────────────────────────────
# Server-side ElevenLabs credentials (for signed URLs / future server calls).
ELEVENLABS_API_KEY=
ELEVENLABS_AGENT_ID=

# Public agent id consumed by the in-browser ConvAI widget.
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=

# Bearer token the ElevenLabs agent must send to /api/onboarding/voice/*.
# If unset, the voice endpoints are DISABLED (fail closed, return 503).
# Generate a strong random value, e.g.: openssl rand -hex 32
ONBOARDING_AGENT_SERVICE_TOKEN=

# Toggle the "Hablar con el agente" voice block in the UI.
NEXT_PUBLIC_ONBOARDING_VOICE_ENABLED=false
```

## Behavior matrix

| Variable group        | Set                                  | Unset (fallback)                          |
| --------------------- | ------------------------------------ | ----------------------------------------- |
| `KV_REST_API_*`       | Durable Redis sessions               | In-memory store (demo only)               |
| `ANTHROPIC/OPENAI`    | LLM-driven conversational interview  | Deterministic scripted interview          |
| `ONBOARDING_AGENT_SERVICE_TOKEN` | Voice endpoints enabled   | Voice endpoints return 503 (fail closed)  |
| `NEXT_PUBLIC_ONBOARDING_VOICE_ENABLED` | Voice block shown  | Text-only onboarding (still complete)     |

Nothing in the above is required to run the onboarding by text locally.
