'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { Data } from '@puckeditor/core';
import { Puck } from '@puckeditor/core';
import { createAiPlugin } from '@puckeditor/plugin-ai';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import config from '@/puck.config';
import { markCampaignSentAction } from '@/app/actions';
import { protocol, rootDomain } from '@/lib/utils';

const AUTOSAVE_DELAY_MS = 1000;

// Chat attachments are disabled: that path uploads to Puck Cloud's CDN
// (cdn.puck.run) and 500s without a configured Puck Cloud project. Images are
// uploaded to Cloudinary instead, via the custom field on the Image/Product
// blocks. Re-enable only if Puck Cloud is set up with an apiKey.
const aiPlugin = createAiPlugin({
  chat: {
    attachments: {
      enabled: false
    }
  }
});

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
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const savePage = useCallback(
    (next: Data) => {
      void fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subdomain, slug, data: next })
      });
    },
    [subdomain, slug]
  );

  // Flush any pending autosave when the editor unmounts.
  useEffect(() => () => clearTimeout(saveTimer.current), []);

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
      onChange={(next) => {
        clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => savePage(next), AUTOSAVE_DELAY_MS);
      }}
      overrides={{
        header: ({ children }) => (
          <div className="flex items-center">
            <a
              href="/admin"
              className="flex items-center gap-1 whitespace-nowrap px-4 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </a>
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        ),
        headerActions: () => (
          <a
            href={`${protocol}://${subdomain}.${rootDomain}/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
          >
            <ExternalLink className="h-4 w-4" />
            Ver sitio web
          </a>
        )
      }}
    />
  );
}
