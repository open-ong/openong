import type { Metadata } from 'next';
import Link from 'next/link';
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
            <a href="#modulos">Módulos</a>
            <a href="#como">Cómo funciona</a>
            <a href="#casos">Casos de uso</a>
            <a href="#open-source">Open source</a>
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
                Más fondos para tu causa, con inteligencia artificial.
              </h1>
              <p className="lead reveal" data-d="2">
                Demasiadas organizaciones con una gran misión no logran
                financiarse. OpenONG usa inteligencia artificial para crear tus
                campañas de crowdfunding y tu tienda solidaria — listas para
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
                  <span className="dot" /> Open source y self-hostable
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
                  <span>Nuevo socio · $15/mes</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============ MODULES ============ */}
        <section className="section" id="modulos">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">Los módulos</span>
              <h2 className="h2">Una suite completa para financiar tu causa.</h2>
              <p className="lead muted">
                Cada módulo es una app lista para usar. Actívalos según los
                necesites — la IA los conecta y los mantiene trabajando por ti.
              </p>
            </div>

            <div className="mod-grid">
              {/* Wide: Campaigns */}
              <article className="card mod wide reveal">
                <div className="app-ico">
                  <span className="gl gl-circle" />
                </div>
                <span className="tag">Módulo · Campañas</span>
                <h3 className="h3">Webs de crowdfunding que convierten.</h3>
                <p>
                  La IA redacta tu narrativa, define metas realistas y genera una
                  página de campaña con pasarela de pago y seguimiento en tiempo
                  real.
                </p>
                <div className="mod-mock">
                  <div className="mm-bar">
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="mm-body">
                    <div className="ph" />
                    <div className="mm-lines">
                      <b />
                      <b />
                      <b />
                    </div>
                  </div>
                </div>
              </article>

              {/* Wide: Store */}
              <article className="card mod wide reveal" data-d="1">
                <div className="app-ico">
                  <span className="gl gl-square" />
                </div>
                <span className="tag">Módulo · Tienda</span>
                <h3 className="h3">Tu tienda solidaria, online.</h3>
                <p>
                  Vende productos y merchandising para financiarte. Catálogo,
                  pagos y envíos configurados automáticamente, listos para
                  publicar.
                </p>
                <div className="mod-mock">
                  <div className="mm-bar">
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="mm-body">
                    <div className="ph" />
                    <div className="mm-lines">
                      <b />
                      <b />
                      <b />
                    </div>
                  </div>
                </div>
              </article>

              {/* AI engine */}
              <article className="card mod wide reveal" data-d="1">
                <div className="app-ico">
                  <span className="gl gl-ring" />
                </div>
                <span className="tag">Núcleo · IA</span>
                <h3 className="h3">La IA que entiende tu causa.</h3>
                <p>
                  Aprende de tu organización y redacta, diseña y optimiza cada
                  canal.
                </p>
                <ul className="feats">
                  <li>Aprende tu misión y tono</li>
                  <li>Crea textos, imágenes y metas</li>
                  <li>Optimiza con cada donación</li>
                </ul>
              </article>

              {/* Dashboard */}
              <article className="card mod wide reveal" data-d="2">
                <div className="app-ico">
                  <span className="gl gl-tri" />
                </div>
                <span className="tag">Módulo · Panel</span>
                <h3 className="h3">Todo tu financiamiento, en una vista.</h3>
                <p>
                  Donantes, socios recurrentes e ingresos por canal en tiempo
                  real.
                </p>
                <ul className="feats">
                  <li>Ingresos por canal y campaña</li>
                  <li>Socios recurrentes y bajas</li>
                  <li>Proyecciones y alertas</li>
                </ul>
              </article>
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
              <h2 className="h2">De tu misión a tus fondos en tres pasos.</h2>
              <p className="lead muted">
                Sin agencias, sin esperas. Tú cuentas tu causa; la IA hace el
                trabajo pesado.
              </p>
            </div>

            <div className="steps">
              <article className="step reveal">
                <span className="num" />
                <span className="ln">———▸</span>
                <h3 className="h3">Cuéntale tu causa</h3>
                <p>
                  Describe tu ONG, tu misión y tus metas. La IA aprende tu
                  contexto, tu tono y a quién quieres llegar.
                </p>
                <div className="vis">
                  <div className="mm-lines" style={{ flex: 1 }}>
                    <b
                      style={{
                        height: 8,
                        borderRadius: 4,
                        background: 'var(--surface-2)',
                        width: '70%'
                      }}
                    />
                    <b
                      style={{
                        height: 8,
                        borderRadius: 4,
                        background: 'var(--surface-2)',
                        width: '90%'
                      }}
                    />
                  </div>
                </div>
              </article>
              <article className="step reveal" data-d="1">
                <span className="num" />
                <span className="ln">———▸</span>
                <h3 className="h3">Genera tus canales</h3>
                <p>
                  Campañas de crowdfunding, tienda online y panel de donaciones
                  creados automáticamente, coherentes y listos para revisar.
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
                <span className="num" />
                <h3 className="h3">Publica y capta</h3>
                <p>
                  Lanza en días y recibe donaciones por todos los canales desde el
                  primer momento. La IA optimiza con cada resultado.
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
              <h2 className="h2">Hecho para cada tipo de organización.</h2>
              <p className="lead muted">
                Da igual tu causa: OpenONG adapta los canales, el lenguaje y las
                metas a tu misión.
              </p>
            </div>

            <div className="cases">
              <article className="case reveal">
                <div className="thumb">
                  <span className="badge">
                    <span className="gl gl-circle" />
                  </span>
                </div>
                <div className="body">
                  <h3>Protección animal</h3>
                  <p>
                    Campañas de urgencia para rescates y una tienda de
                    apadrinamientos recurrentes.
                  </p>
                  <span className="meta">Campañas + Apadrinamiento</span>
                </div>
              </article>
              <article className="case reveal" data-d="1">
                <div className="thumb">
                  <span className="badge">
                    <span className="gl gl-square" />
                  </span>
                </div>
                <div className="body">
                  <h3>Medio ambiente</h3>
                  <p>
                    Crowdfunding por proyecto y socios recurrentes que financian
                    tus proyectos a largo plazo.
                  </p>
                  <span className="meta">Crowdfunding + Socios</span>
                </div>
              </article>
              <article className="case reveal" data-d="2">
                <div className="thumb">
                  <span className="badge">
                    <span className="gl gl-diamond" />
                  </span>
                </div>
                <div className="body">
                  <h3>Educación e infancia</h3>
                  <p>
                    Tienda solidaria con productos hechos por la comunidad y panel
                    de donantes transparente.
                  </p>
                  <span className="meta">Tienda + Panel</span>
                </div>
              </article>
              <article className="case reveal">
                <div className="thumb">
                  <span className="badge">
                    <span className="gl gl-ring" />
                  </span>
                </div>
                <div className="body">
                  <h3>Salud y acceso</h3>
                  <p>
                    Campañas de tratamiento con metas claras y seguimiento del
                    impacto en tiempo real.
                  </p>
                  <span className="meta">Campañas + Impacto</span>
                </div>
              </article>
              <article className="case reveal" data-d="1">
                <div className="thumb">
                  <span className="badge">
                    <span className="gl gl-tri" />
                  </span>
                </div>
                <div className="body">
                  <h3>Acción social local</h3>
                  <p>
                    Campañas por barrio y alta de socios recurrentes con un panel
                    de donantes transparente.
                  </p>
                  <span className="meta">Campañas + Socios</span>
                </div>
              </article>
              <article className="case reveal" data-d="2">
                <div className="thumb">
                  <span className="badge">
                    <span className="gl gl-circle" />
                  </span>
                </div>
                <div className="body">
                  <h3>Cooperación internacional</h3>
                  <p>
                    Múltiples campañas por país coordinadas desde un único panel de
                    financiación.
                  </p>
                  <span className="meta">Multi-campaña + Panel</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ============ METRICS ============ */}
        <section className="section grid-bg" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="metrics">
              <div className="metric reveal">
                <div className="big">5 días</div>
                <div className="lab">
                  Del registro a tu primera campaña publicada.
                </div>
              </div>
              <div className="metric reveal" data-d="1">
                <div className="big">3 canales</div>
                <div className="lab">
                  Crowdfunding, tienda y panel de donaciones — coordinados por la
                  IA.
                </div>
              </div>
              <div className="metric reveal" data-d="2">
                <div className="big">0 código</div>
                <div className="lab">
                  Sin equipo técnico ni agencias. Tú diriges, la IA ejecuta.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ OPEN SOURCE ============ */}
        <section className="section" id="open-source">
          <div className="wrap">
            <div className="section-head center reveal">
              <span className="eyebrow">Open source</span>
              <h2 className="h2">Tuyo de verdad: open source y self-hostable.</h2>
              <p className="lead muted">
                OpenONG es software libre. Auditá el código, contribuí o
                desplegalo en tu propia infraestructura — sin ataduras a un
                proveedor y con control total sobre los datos de tu organización.
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
              <h2>¿Lista tu ONG para ser sostenible?</h2>
              <p>
                Crea tu organización en OpenONG y empieza a montar tus canales de
                financiación con tu causa real — en minutos.
              </p>
              <div className="row">
                <Link className="btn btn-primary btn-lg btn-arrow" href="/create">
                  Empezar
                </Link>
                <a className="btn btn-ghost btn-lg" href="#modulos">
                  Explorar los módulos
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
                La plataforma de IA, open source y self-hostable, que ayuda a tu
                ONG a recaudar fondos y financiar su misión.
              </p>
            </div>
            <div className="col">
              <h4>Producto</h4>
              <a href="#modulos">Módulos</a>
              <a href="#como">Cómo funciona</a>
              <a href="#casos">Casos de uso</a>
              <Link href="/create">Crear tu ONG</Link>
            </div>
            <div className="col">
              <h4>Proyecto</h4>
              <a href="#open-source">Open source</a>
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
              Open source · Licencia FSL-1.1
            </a>
          </div>
        </footer>
      </main>

      <LandingEffects />
    </div>
  );
}
