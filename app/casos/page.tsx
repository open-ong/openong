import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LandingEffects } from '../landing-effects';
import '../landing.css';

export const metadata: Metadata = {
  title: 'Casos de uso — OpenONG',
  description:
    'Comedores, rescate animal, medio ambiente, educación, salud y más: descubrí cómo distintas organizaciones sin fines de lucro recaudan con OpenONG.'
};

type Caso = {
  title: string;
  desc: string;
  meta: string;
  img: string;
  alt: string;
};

const CASOS: Caso[] = [
  {
    title: 'Comedores y bancos de alimentos',
    desc: 'Donantes recurrentes que sostienen cada plato y campañas para las épocas de mayor necesidad.',
    meta: 'Donaciones recurrentes',
    img: 'https://images.pexels.com/photos/6646987/pexels-photo-6646987.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Voluntario sirviendo comida en un comedor comunitario'
  },
  {
    title: 'Rescate y protección animal',
    desc: 'Campañas de urgencia para rescates y padrinos que acompañan a cada animal mes a mes.',
    meta: 'Campañas + Padrinos',
    img: 'https://images.pexels.com/photos/12483700/pexels-photo-12483700.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Persona acariciando a un perro rescatado en un refugio'
  },
  {
    title: 'Reforestación y medio ambiente',
    desc: 'Crowdfunding por proyecto para financiar plantaciones y jornadas de limpieza con metas claras.',
    meta: 'Crowdfunding por meta',
    img: 'https://images.pexels.com/photos/8543037/pexels-photo-8543037.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Voluntarios plantando árboles en una jornada ambiental'
  },
  {
    title: 'Educación y apoyo escolar',
    desc: 'Becas, útiles y apoyo escolar financiados con campañas y padrinos que aportan todos los meses.',
    meta: 'Padrinos + Campañas',
    img: 'https://images.pexels.com/photos/8466703/pexels-photo-8466703.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Niños y niñas aprendiendo en un aula'
  },
  {
    title: 'Salud y acceso comunitario',
    desc: 'Campañas para tratamientos, insumos y operativos de salud, con metas y seguimiento transparente.',
    meta: 'Campañas por meta',
    img: 'https://images.pexels.com/photos/6129444/pexels-photo-6129444.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Profesional de la salud atendiendo en un centro comunitario'
  },
  {
    title: 'Adultos mayores y acompañamiento',
    desc: 'Donantes recurrentes que sostienen programas de acompañamiento y cuidado para personas mayores.',
    meta: 'Donaciones recurrentes',
    img: 'https://images.pexels.com/photos/6647025/pexels-photo-6647025.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Voluntaria acompañando a una persona mayor'
  },
  {
    title: 'Personas en situación de calle',
    desc: 'Refugios, viandas y kits de abrigo financiados con campañas urgentes y donantes que aportan cada mes.',
    meta: 'Campañas + Donaciones',
    img: 'https://images.pexels.com/photos/9532259/pexels-photo-9532259.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Voluntario entregando ayuda a una persona en situación de calle'
  },
  {
    title: 'Inclusión y discapacidad',
    desc: 'Terapias, equipamiento y programas de inclusión sostenidos por padrinos y campañas por meta.',
    meta: 'Padrinos + Campañas',
    img: 'https://images.pexels.com/photos/8127701/pexels-photo-8127701.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Persona en silla de ruedas acompañada por un cuidador'
  },
  {
    title: 'Deporte y juventud',
    desc: 'Escuelitas deportivas y becas para chicos, con socios recurrentes y campañas por temporada.',
    meta: 'Socios recurrentes',
    img: 'https://images.pexels.com/photos/8813567/pexels-photo-8813567.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Chicos jugando al fútbol en una cancha comunitaria'
  },
  {
    title: 'Cultura y arte comunitario',
    desc: 'Talleres, orquestas y espacios culturales de barrio financiados con campañas y aportes mensuales.',
    meta: 'Campañas + Socios',
    img: 'https://images.pexels.com/photos/18649983/pexels-photo-18649983.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Niños aprendiendo música en un taller comunitario'
  },
  {
    title: 'Mujeres e igualdad de género',
    desc: 'Acompañamiento, capacitación y refugios para mujeres, con donantes recurrentes y campañas puntuales.',
    meta: 'Donaciones recurrentes',
    img: 'https://images.pexels.com/photos/7176302/pexels-photo-7176302.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Grupo de mujeres en un encuentro de apoyo comunitario'
  },
  {
    title: 'Agua y saneamiento',
    desc: 'Pozos, redes de agua y saneamiento financiados con crowdfunding por proyecto y metas claras.',
    meta: 'Crowdfunding por meta',
    img: 'https://images.pexels.com/photos/11614346/pexels-photo-11614346.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Manos recogiendo agua limpia de una canilla'
  }
];

export default function CasosPage() {
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

      {/* ============ NAV ============ */}
      <header className="topbar">
        <div className="wrap">
          <Link className="brand" href="/" aria-label="OpenONG inicio">
            <span className="logo" />
            <span>
              Open<b>ONG</b>
            </span>
          </Link>
          <div className="nav-right">
            <Link className="btn btn-ghost" href="/">
              <ArrowLeft size={16} strokeWidth={2.2} />
              Inicio
            </Link>
            <Link className="btn btn-primary" href="/create">
              Empezar
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ============ HEADER ============ */}
        <section className="section grid-bg" style={{ background: 'var(--bg-2)' }}>
          <div className="wrap">
            <div className="section-head center reveal">
              <span className="eyebrow">Casos de uso</span>
              <h2 className="h2">Organizaciones reales, recaudando con OpenONG.</h2>
              <p className="lead muted">
                Da igual tu causa: OpenONG adapta los canales y las metas a tu
                misión. Estos son algunos de los tipos de organización que más se
                benefician.
              </p>
            </div>
          </div>
        </section>

        {/* ============ CASES ============ */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="cases">
              {CASOS.map((caso, i) => (
                <article
                  key={caso.title}
                  className="case reveal"
                  data-d={((i % 3) + 1).toString()}
                >
                  <div className="thumb">
                    <img src={caso.img} alt={caso.alt} loading="lazy" />
                  </div>
                  <div className="body">
                    <h3>{caso.title}</h3>
                    <p>{caso.desc}</p>
                    <span className="meta">{caso.meta}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className="cta-wrap">
          <div className="wrap">
            <div className="cta reveal">
              <span className="eyebrow">Empieza hoy</span>
              <h2>¿No ves tu causa? OpenONG se adapta a ella.</h2>
              <p>
                Contale tu misión y la IA arma tus canales de recaudación con tu
                causa real — en minutos, sin equipo técnico.
              </p>
              <div className="row">
                <Link className="btn btn-primary btn-lg btn-arrow" href="/create">
                  Empezar
                </Link>
                <Link className="btn btn-ghost btn-lg" href="/">
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingEffects />
    </div>
  );
}
