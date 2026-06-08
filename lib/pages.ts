import type { Data } from '@puckeditor/core';
import { redis } from '@/lib/redis';

function pageKey(orgId: string, slug: string) {
  return `org:${orgId}:page:${slug}`;
}

export async function getPageData(orgId: string, slug: string) {
  const data = await redis.get<Data>(pageKey(orgId, slug));
  return data;
}

export async function savePageData(orgId: string, slug: string, data: Data) {
  await redis.set(pageKey(orgId, slug), data);
}
