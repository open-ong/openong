import type { Metadata } from 'next';
import Link from 'next/link';
import { PenLine, Sparkles, Rocket } from 'lucide-react';
import { LandingEffects } from './landing-effects';
import './landing.css';

export const metadata: Metadata = {
  title: 'OpenONG — Recaudación con IA para ONGs sostenibles',
  description:
    'La plataforma de IA que ayuda a tu ONG a recaudar fondos: crea tus campañas de crowdfunding y tu tienda solidaria, listas para recaudar en días.'
};

export default function HomePage() {
  return (
    <div className="openong-landing" id="top">
      {/* Design fonts — hoisted and deduped by Next.js */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=Space+Grotesk:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ============ NAV / SYSTEM MENU BAR ============ */}
      <header className="topbar">
        <div className="wrap">
          <a className="brand" href="#top" aria-label="OpenONG inicio">
            <span className="logo" />
            <span>
              Open<b>ONG</b>
            </span>
          </a>
          <nav className="nav-menu" aria-label="Principal">
            <a href="#como">Cómo funciona</a>
            <a href="#casos">Casos de uso</a>
            <a href="#open-source">Código abierto</a>
          </nav>
          <div className="nav-right">
            <span className="clock" id="clock">
              --:--
            </span>
            <a
              className="btn btn-ghost"
              href="https://github.com/open-ong/openong"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              GitHub
            </a>
            <Link className="btn btn-primary" href="/create">
              Empezar
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ============ HERO ============ */}
        <section className="hero grid-bg">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <span className="eyebrow reveal">
                Plataforma de IA para recaudación
              </span>
              <h1 className="h-display reveal" data-d="1">
                Más fondos para tu causa, con IA.
              </h1>
              <p className="lead reveal" data-d="2">
                OpenONG te ayuda a crear campañas online — listas para
                recaudar en días, no en meses.
              </p>
              <div className="hero-cta reveal" data-d="3">
                <Link className="btn btn-primary btn-lg btn-arrow" href="/create">
                  Empezar
                </Link>
                <a className="btn btn-ghost btn-lg" href="#como">
                  Ver cómo funciona
                </a>
              </div>
              <div className="hero-meta reveal" data-d="4">
                <span className="chip">
                  <span className="dot" /> Sin conocimientos técnicos
                </span>
                <span className="chip">
                  <span className="dot" /> Listo para publicar en días
                </span>
                <span className="chip">
                  <span className="dot" /> Pagos y donaciones integrados
                </span>
                <span className="chip">
                  <span className="dot" /> Self-hostable y de código abierto
                </span>
              </div>
            </div>

            {/* App window mock */}
            <div className="hero-visual reveal" data-d="2">
              <div className="window">
                <div className="win-bar">
                  <div className="win-dots">
                    <i />
                    <i />
                    <i />
                  </div>
                  <span className="win-title">
                    openong&nbsp;·&nbsp;<b>Panel de recaudación</b>
                  </span>
                </div>
                <div className="win-body">
                  <div className="win-rail">
                    <div className="ico on">
                      <span className="g g-square" />
                    </div>
                    <div className="ico">
                      <span className="g g-circle" />
                    </div>
                    <div className="ico">
                      <span className="g g-diamond" />
                    </div>
                    <div className="ico">
                      <span className="g g-bars" />
                    </div>
                  </div>
                  <div className="win-main">
                    <div className="win-head">
                      <span className="t">Resumen · Octubre</span>
                      <span className="live">EN VIVO</span>
                    </div>
                    <div className="stat-row">
                      <div className="stat">
                        <div className="k">Recaudado</div>
                        <div className="v">
                          $48,2k<small>▲ 18%</small>
                        </div>
                      </div>
                      <div className="stat">
                        <div className="k">Socios</div>
                        <div className="v">
                          1.240<small>▲ 9%</small>
                        </div>
                      </div>
                      <div className="stat">
                        <div className="k">Canales</div>
                        <div className="v">3</div>
                      </div>
                    </div>
                    <div className="goal">
                      <div className="row">
                        <span className="lbl">Campaña · Agua limpia</span>
                        <span className="amt">$48.200 / $60.000</span>
                      </div>
                      <div className="bar">
                        <i id="goalbar" style={{ width: 0 }} />
                      </div>
                      <div className="sub">
                        80% de la meta · 312 donaciones esta semana
                      </div>
                    </div>
                    <div className="win-chips">
                      <span>＋ Campaña</span>
                      <span>＋ Tienda</span>
                      <span>＋ Panel</span>
                      <span>IA · activa</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="float-card">
                <span className="av">IA</span>
                <span className="tx">
                  <b>Donación recurrente</b>
                  <span>Nuevo socio · $1500/mes</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============ HOW IT WORKS ============ */}
        <section
          className="section grid-bg"
          id="como"
          style={{ background: 'var(--bg-2)' }}
        >
          <div className="wrap">
            <div className="section-head center reveal">
              <span className="eyebrow">Cómo funciona</span>
              <h2 className="h2">
                De tu misión a tus fondos, <br /> en tres pasos.
              </h2>
              <p className="lead muted">
                Sin agencias, sin esperas. La IA hace el
                trabajo pesado.
              </p>
            </div>

            <div className="steps">
              <article className="step reveal">
                <div className="step-head">
                  <span className="step-ico">
                    <PenLine size={18} strokeWidth={2.2} />
                  </span>
                  <span className="num" />
                </div>
                <span className="ln">———▸</span>
                <h3 className="h3">Cuéntale tu causa</h3>
                <p>
                  Describe tu ONG, tu misión y tus metas. La IA aprende tu
                  contexto, tu tono y a quién quieres llegar.
                </p>
                <div className="vis">
                  <div className="vis-fill">
                    <span className="win-chips">
                      <span>Tu misión</span>
                      <span>Tu causa</span>
                    </span>
                    <div className="vis-lines">
                      <b style={{ width: '90%' }} />
                      <b style={{ width: '60%' }} />
                    </div>
                  </div>
                </div>
              </article>
              <article className="step reveal" data-d="1">
                <div className="step-head">
                  <span className="step-ico">
                    <Sparkles size={18} strokeWidth={2.2} />
                  </span>
                  <span className="num" />
                </div>
                <span className="ln">———▸</span>
                <h3 className="h3">Genera tus canales</h3>
                <p>
                  Tu web de campaña, tienda y panel de donaciones, creados y
                  listos para revisar.
                </p>
                <div className="vis">
                  <span className="win-chips">
                    <span>Campaña</span>
                    <span>Tienda</span>
                    <span>Panel</span>
                  </span>
                </div>
              </article>
              <article className="step reveal" data-d="2">
                <div className="step-head">
                  <span className="step-ico">
                    <Rocket size={18} strokeWidth={2.2} />
                  </span>
                  <span className="num" />
                </div>
                <h3 className="h3">Publica y capta</h3>
                <p>
                  Lanza en días y recibe donaciones por todos los canales desde el
                  primer momento.
                </p>
                <div className="vis">
                  <div
                    className="goal"
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      border: 'none',
                      background: 'transparent'
                    }}
                  >
                    <div className="bar" style={{ marginTop: 0 }}>
                      <i style={{ width: '72%' }} />
                    </div>
                    <div className="sub" style={{ marginTop: 6 }}>
                      Recaudando · 72% de la meta
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ============ USE CASES ============ */}
        <section className="section" id="casos">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">Casos de uso</span>
              <h2 className="h2">Pensado para organizaciones reales.</h2>
              <p className="lead muted">
                Da igual tu causa: OpenONG adapta los canales y las metas a tu
                misión. Estos son algunos de los casos más comunes.
              </p>
            </div>

            <div className="cases">
              <article className="case reveal">
                <div className="thumb">
                  <img
                    src="https://images.pexels.com/photos/6646987/pexels-photo-6646987.jpeg?auto=compress&cs=tinysrgb&w=900"
                    alt="Voluntario sirviendo comida en un comedor comunitario"
                    loading="lazy"
                  />
                </div>
                <div className="body">
                  <h3>Comedores y bancos de alimentos</h3>
                  <p>
                    Donantes recurrentes que sostienen cada plato y campañas para
                    las épocas de mayor necesidad.
                  </p>
                  <span className="meta">Donaciones recurrentes</span>
                </div>
              </article>
              <article className="case reveal" data-d="1">
                <div className="thumb">
                  <img
                    src="https://images.pexels.com/photos/12483700/pexels-photo-12483700.jpeg?auto=compress&cs=tinysrgb&w=900"
                    alt="Persona acariciando a un perro rescatado en un refugio"
                    loading="lazy"
                  />
                </div>
                <div className="body">
                  <h3>Rescate y protección animal</h3>
                  <p>
                    Campañas de urgencia para rescates y padrinos que acompañan a
                    cada animal mes a mes.
                  </p>
                  <span className="meta">Campañas + Padrinos</span>
                </div>
              </article>
              <article className="case reveal" data-d="2">
                <div className="thumb">
                  <img
                    src="https://images.pexels.com/photos/8543037/pexels-photo-8543037.jpeg?auto=compress&cs=tinysrgb&w=900"
                    alt="Voluntarios plantando árboles en una jornada ambiental"
                    loading="lazy"
                  />
                </div>
                <div className="body">
                  <h3>Reforestación y medio ambiente</h3>
                  <p>
                    Crowdfunding por proyecto para financiar plantaciones y
                    jornadas de limpieza con metas claras.
                  </p>
                  <span className="meta">Crowdfunding por meta</span>
                </div>
              </article>
            </div>

            <div className="cases-more reveal">
              <Link className="btn btn-ghost btn-lg btn-arrow" href="/casos">
                Ver más casos
              </Link>
            </div>
          </div>
        </section>

        {/* ============ OPEN SOURCE ============ */}
        <section className="section" id="open-source">
          <div className="wrap">
            <div className="section-head center reveal">
              <span className="eyebrow">Código abierto</span>
              <h2 className="h2">Self-hostable de verdad: desplegalo donde quieras.</h2>
              <p className="lead muted">
                Desplegá OpenONG en tu propia infraestructura, sin ataduras a un
                proveedor y con control total sobre los datos de tu organización.
                Al ser de código abierto, podés auditarlo y adaptarlo a tu causa.
              </p>
              <div
                className="row"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 12,
                  justifyContent: 'center',
                  marginTop: 28
                }}
              >
                <a
                  className="btn btn-primary btn-lg"
                  href="https://github.com/open-ong/openong"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  Ver en GitHub
                </a>
                <a
                  className="btn btn-ghost btn-lg"
                  href="https://github.com/open-ong/openong#readme"
                  target="_blank"
                  rel="noreferrer"
                >
                  Guía de self-hosting
                </a>
              </div>

              <div className="os-tech reveal" data-d="1">
                <span className="os-tech-label">Construido con</span>
                <div className="os-tech-row">
                  <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
                    Next.js
                  </a>
                  <a href="https://react.dev/" target="_blank" rel="noreferrer">
                    React
                  </a>
                  <a href="https://vercel.com/" target="_blank" rel="noreferrer">
                    Vercel
                  </a>
                  <a
                    href="https://tailwindcss.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Tailwind CSS
                  </a>
                  <a href="https://upstash.com/" target="_blank" rel="noreferrer">
                    Upstash Redis
                  </a>
                  <a href="https://clerk.com/" target="_blank" rel="noreferrer">
                    Clerk
                  </a>
                  <a
                    href="https://puckeditor.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Puck AI
                  </a>
                  <a href="https://posthog.com/" target="_blank" rel="noreferrer">
                    PostHog
                  </a>
                  <a
                    href="https://cloudinary.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Cloudinary
                  </a>
                  <a
                    href="https://www.anthropic.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Anthropic
                  </a>
                  <a
                    href="https://elevenlabs.io/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    ElevenLabs
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className="cta-wrap" id="demo">
          <div className="wrap">
            <div className="cta reveal">
              <span className="eyebrow">Empieza hoy</span>
              <h2>Tu primera campaña de recaudación con OpenONG.</h2>
              <p>
                Crea tu organización y lanza tu primera campaña con tu causa real
                — en minutos, sin equipo técnico.
              </p>
              <div className="row">
                <Link className="btn btn-primary btn-lg btn-arrow" href="/create">
                  Empezar
                </Link>
                <a className="btn btn-ghost btn-lg" href="#casos">
                  Ver casos de uso
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============ FOOTER ============ */}
        <footer className="footer">
          <div className="wrap foot-grid">
            <div className="col foot-brand">
              <a className="brand" href="#top">
                <span className="logo" />
                <span>
                  Open<b>ONG</b>
                </span>
              </a>
              <p>
                La plataforma de IA, self-hostable y de código abierto, que ayuda
                a tu ONG a recaudar fondos y financiar su misión.
              </p>
            </div>
            <div className="col">
              <h4>Producto</h4>
              <a href="#como">Cómo funciona</a>
              <a href="#casos">Casos de uso</a>
              <Link href="/create">Crear tu ONG</Link>
            </div>
            <div className="col">
              <h4>Proyecto</h4>
              <a href="#open-source">Código abierto</a>
              <a
                href="https://github.com/open-ong/openong"
                target="_blank"
                rel="noreferrer"
              >
                Código en GitHub
              </a>
              <a
                href="https://github.com/open-ong/openong#readme"
                target="_blank"
                rel="noreferrer"
              >
                Self-hosting
              </a>
            </div>
          </div>
          <div className="wrap foot-bottom">
            <span>© 2026 OpenONG · Recaudación con IA para ONGs</span>
            <a
              href="https://github.com/open-ong/openong/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer"
            >
              Código abierto · Licencia FSL-1.1
            </a>
          </div>
        </footer>
      </main>

      <LandingEffects />
    </div>
  );
}
