'use client';

import { useState } from 'react';
import type { TrafficDay } from '@/lib/traffic';
import type { OrderStatus } from '@/lib/orders';

type DashCampaign = { slug: string; title: string };

export type DashOrder = {
  id: string;
  createdAt: number;
  buyerName: string;
  campaignSlug: string;
  total: number;
  status: OrderStatus;
};

const ORDER_STATUS: Record<OrderStatus, { label: string; cls: string }> = {
  por_validar: { label: 'Por validar', cls: 'bg-amber-100 text-amber-700' },
  pago_pendiente_envio: { label: 'Pend. envío', cls: 'bg-blue-100 text-blue-700' },
  entregado: { label: 'Listo', cls: 'bg-emerald-100 text-emerald-700' },
  rechazado: { label: 'Rechazado', cls: 'bg-rose-100 text-rose-700' }
};

/** 1.240 grouping — manual so SSR and CSR always match. */
function fmt(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** DD/MM in UTC so server and client render the same string. */
function shortDate(ts: number): string {
  const d = new Date(ts);
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}

/* ---------- tiny SVG area chart (no deps) ---------- */

function AreaChart({
  values,
  color,
  gradId
}: {
  values: number[];
  color: string;
  gradId: string;
}) {
  const W = 100;
  const H = 40;
  const pad = 3;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const stepX = W / Math.max(1, values.length - 1);
  const pts = values.map((v, i) => {
    const x = i * stepX;
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return [x, y] as const;
  });
  const line = pts
    .map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(' ');
  const area = `${line} L${W} ${H} L0 ${H} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-20 w-full"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ---------- KPI ---------- */

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
      <div className="font-mono text-[0.56rem] uppercase tracking-wide text-gray-400">
        {label}
      </div>
      <div className="mt-0.5 text-lg font-bold tracking-tight text-gray-900">
        {value}
      </div>
    </div>
  );
}

/* ---------- main ---------- */

export function TrafficDashboard({
  subdomain,
  campaigns,
  traffic,
  orders
}: {
  subdomain: string;
  campaigns: DashCampaign[];
  traffic: TrafficDay[];
  orders: DashOrder[];
}) {
  const [filter, setFilter] = useState<string>('all');

  const slugTitle = Object.fromEntries(
    campaigns.map((c) => [c.slug, c.title])
  ) as Record<string, string>;

  // Per-day visits, respecting the campaign filter.
  const visitsSeries = traffic.map((d) =>
    filter === 'all'
      ? Object.values(d.views).reduce((a, b) => a + b, 0)
      : d.views[filter] ?? 0
  );
  const totalVisits = visitsSeries.reduce((a, b) => a + b, 0);

  // Org-level uniques are not broken down per campaign.
  const uniques =
    filter === 'all'
      ? traffic.reduce((a, d) => a + d.uniques, 0)
      : null;

  const periodStartTs =
    Date.now() - traffic.length * 86_400_000;
  const ordersInPeriod = orders.filter(
    (o) =>
      o.createdAt >= periodStartTs &&
      (filter === 'all' || o.campaignSlug === filter)
  );
  const conversion =
    totalVisits > 0 ? (ordersInPeriod.length / totalVisits) * 100 : 0;

  const trafficDelta =
    visitsSeries[0] > 0
      ? Math.round(
          ((visitsSeries[visitsSeries.length - 1] - visitsSeries[0]) /
            visitsSeries[0]) *
            100
        )
      : 0;

  // Purchases table: real orders, newest first, filtered by campaign.
  const purchases = orders
    .filter((o) => filter === 'all' || o.campaignSlug === filter)
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Window chrome + filter */}
      <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 bg-gray-50/80 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="font-mono text-xs tracking-wide text-gray-400">
          {subdomain}&nbsp;·&nbsp;
          <span className="font-semibold text-gray-600">Panel de tráfico</span>
        </span>

        <div className="ml-auto flex items-center gap-3">
          <label className="sr-only" htmlFor="campaign-filter">
            Filtrar por campaña
          </label>
          <select
            id="campaign-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 shadow-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          >
            <option value="all">Todas las campañas</option>
            {campaigns.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.62rem] tracking-widest text-emerald-600">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            EN VIVO
          </span>
        </div>
      </div>

      {/* Body: purchases (left) + traffic (right) */}
      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
        {/* LEFT — purchases table (real orders) */}
        <div className="rounded-lg border border-gray-200">
          <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
            <span className="font-mono text-[0.6rem] uppercase tracking-wide text-gray-400">
              Compras recientes
            </span>
            <span className="text-[0.6rem] text-gray-400">
              {purchases.length} operaciones
            </span>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {purchases.length === 0 ? (
              <p className="px-3 py-10 text-center text-xs text-gray-400">
                Todavía no hay compras
                {filter === 'all' ? '' : ' para esta campaña'}.
              </p>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-gray-50 text-[0.58rem] uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="px-3 py-2 font-medium">Fecha</th>
                    <th className="px-3 py-2 font-medium">Cliente</th>
                    <th className="px-3 py-2 text-right font-medium">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {purchases.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-3 py-2 text-gray-500">
                        {shortDate(o.createdAt)}
                      </td>
                      <td className="px-3 py-2">
                        <div className="font-medium text-gray-800">
                          {o.buyerName}
                        </div>
                        {filter === 'all' && (
                          <div className="truncate text-[0.6rem] text-gray-400">
                            {slugTitle[o.campaignSlug] ?? o.campaignSlug}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right">
                        <span className="font-semibold text-gray-900">
                          €{fmt(o.total)}
                        </span>
                        <span
                          className={`ml-2 inline-block rounded-full px-1.5 py-0.5 text-[0.55rem] font-medium ${ORDER_STATUS[o.status].cls}`}
                        >
                          {ORDER_STATUS[o.status].label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* RIGHT — traffic KPIs + chart */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            <Kpi label="Visitas · 14d" value={fmt(totalVisits)} />
            <Kpi
              label="Únicos · 14d"
              value={uniques === null ? '—' : fmt(uniques)}
            />
            <Kpi label="Conversión" value={`${conversion.toFixed(1)}%`} />
          </div>

          <div className="relative rounded-lg border border-gray-200 p-3">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[0.6rem] uppercase tracking-wide text-gray-400">
                Tráfico · 14 días
              </span>
              {totalVisits > 0 && (
                <span
                  className={`text-xs font-semibold ${
                    trafficDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {trafficDelta >= 0 ? '▲' : '▼'} {Math.abs(trafficDelta)}%
                </span>
              )}
            </div>
            <div className="mt-2">
              <AreaChart
                values={visitsSeries}
                color="#2563eb"
                gradId="grad-traffic"
              />
            </div>
            {totalVisits === 0 && (
              <p className="absolute inset-x-0 bottom-7 text-center text-xs text-gray-400">
                Sin visitas registradas todavía
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
