'use client';

import type { Data } from '@puckeditor/core';
import { Puck } from '@puckeditor/core';
import { createAiPlugin } from '@puckeditor/plugin-ai';
import config from '@/puck.config';

const aiPlugin = createAiPlugin();

export function Editor({
  subdomain,
  data
}: {
  subdomain: string;
  data: Partial<Data>;
}) {
  return (
    <Puck
      plugins={[aiPlugin]}
      config={config}
      data={data}
      onPublish={async (data) => {
        await fetch('/api/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subdomain, data })
        });
      }}
    />
  );
}
