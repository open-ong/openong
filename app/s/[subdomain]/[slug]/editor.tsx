'use client';

import { useEffect, useRef } from 'react';
import type { Data } from '@puckeditor/core';
import { Puck } from '@puckeditor/core';
import { createAiPlugin } from '@puckeditor/plugin-ai';
import config from '@/puck.config';
import { markCampaignSentAction } from '@/app/actions';

const aiPlugin = createAiPlugin();

export function CampaignEditor({
  subdomain,
  slug,
  data,
  prompt,
  autoSend
}: {
  subdomain: string;
  slug: string;
  data: Partial<Data>;
  prompt: string;
  autoSend: boolean;
}) {
  const sentRef = useRef(false);

  useEffect(() => {
    if (!autoSend || !prompt || sentRef.current) return;

    let cancelled = false;
    let attempts = 0;

    const trySend = () => {
      if (cancelled || sentRef.current) return;

      const api = window.__PUCK_AI;
      if (api?.sendMessage) {
        sentRef.current = true;
        api.sendMessage({
          role: 'user',
          parts: [{ type: 'text', text: prompt }]
        });
        // Persist that the prompt was delivered so it is not re-sent.
        void markCampaignSentAction(subdomain, slug);
        return;
      }

      // The AI plugin attaches window.__PUCK_AI once it mounts; poll briefly.
      if (attempts < 40) {
        attempts += 1;
        setTimeout(trySend, 300);
      }
    };

    const timer = setTimeout(trySend, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [autoSend, prompt, subdomain, slug]);

  return (
    <Puck
      plugins={[aiPlugin]}
      config={config}
      data={data}
      ui={{ plugin: { current: aiPlugin.name }, rightSideBarVisible: true }}
      onPublish={async (published) => {
        await fetch('/api/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subdomain, slug, data: published })
        });
      }}
    />
  );
}
