import { redis } from '@/lib/redis';

export function sanitizeSubdomain(subdomain: string) {
  return subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
}

export type OngData = {
  name: string;
  createdAt: number;
};

export async function getSubdomainData(subdomain: string) {
  const sanitized = sanitizeSubdomain(subdomain);
  const data = await redis.get<OngData>(`subdomain:${sanitized}`);
  return data;
}

export async function getAllSubdomains() {
  const keys = await redis.keys('subdomain:*');

  if (!keys.length) {
    return [];
  }

  const values = await redis.mget<OngData[]>(...keys);

  return keys.map((key, index) => {
    const subdomain = key.replace('subdomain:', '');
    const data = values[index];

    return {
      subdomain,
      name: data?.name || subdomain,
      createdAt: data?.createdAt || Date.now()
    };
  });
}
