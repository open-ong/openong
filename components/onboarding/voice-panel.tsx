'use client';

import { useEffect, useState } from 'react';
import { Mic, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Voice onboarding entry point (ElevenLabs).
 *
 * When `enabled` (NEXT_PUBLIC_ONBOARDING_VOICE_ENABLED=true) AND an
 * `agentId` is provided, this lazy-loads the ElevenLabs ConvAI widget and
 * passes the current `sessionId` as a dynamic variable so the voice agent
 * writes into the SAME onboarding session as the text chat.
 *
 * When disabled or unconfigured, it renders an informational state and the
 * user simply continues by text — the fallback is always functional.
 *
 * TODO(prod): wire a signed-URL / conversation-token endpoint instead of
 * relying solely on the public agent id (see docs/ELEVENLABS_ONBOARDING_AGENT.md).
 */
export function VoicePanel({
  enabled,
  agentId,
  sessionId
}: {
  enabled: boolean;
  agentId?: string;
  sessionId: string;
}) {
  const [open, setOpen] = useState(false);
  const live = enabled && Boolean(agentId);

  useEffect(() => {
    if (!open || !live) return;
    const id = 'elevenlabs-convai-script';
    if (document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);
  }, [open, live]);

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="flex items-center gap-2">
        <Mic className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Completar por voz</h3>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Preferís hablar en lugar de escribir? Hacé la entrevista con nuestro
        agente de voz.
      </p>

      {!live ? (
        <div className="mt-3 flex items-start gap-2 rounded-md bg-background p-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          <span>
            El agente de voz requiere credenciales de ElevenLabs. Por ahora
            seguí por texto — toda la información se guarda igual.
          </span>
        </div>
      ) : !open ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 w-full"
          onClick={() => setOpen(true)}
        >
          <Mic className="size-4" /> Hablar con el agente
        </Button>
      ) : (
        <div className="mt-3">
          {/* The widget reads sessionId so the voice agent writes to the same session.
              The agent's tools call /api/onboarding/voice/* with the bearer token. */}
          {/* @ts-expect-error custom element from the ElevenLabs embed script */}
          <elevenlabs-convai
            agent-id={agentId}
            dynamic-variables={JSON.stringify({ session_id: sessionId })}
          />
        </div>
      )}
    </div>
  );
}
