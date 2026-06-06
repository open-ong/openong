import type { Data } from '@puckeditor/core';
import { redis } from '@/lib/redis';

function sanitize(subdomain: string) {
  return subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
}

export async function getPageData(subdomain: string) {
  const data = await redis.get<Data>(`page:${sanitize(subdomain)}`);
  return data;
}

export async function savePageData(subdomain: string, data: Data) {
  await redis.set(`page:${sanitize(subdomain)}`, data);
}
