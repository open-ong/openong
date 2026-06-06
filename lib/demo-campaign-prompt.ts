import type { CampaignType } from '@/lib/campaigns';

export const OJITOS_FELICES_DEMO_CONTEXT = `
CONTEXTO DEMO OBLIGATORIO

Esta demo NO depende todavia de que el onboarding de voz escriba en backend.
Si falta informacion, usa SIEMPRE este contexto como fuente de verdad.

Organizacion:
- Nombre: Ojitos Felices
- Tipo: ONG / organizacion social
- Ubicacion: Villa Gobernador Galvez, provincia de Santa Fe, Argentina
- Trayectoria: trabajan hace 15 anos
- Tono: cercano, confiable, claro, argentino/rioplatense, sin exagerar

Campanas reales de Ojitos Felices:
- Utiles para el colegio
- Ropa para el invierno
- Dia del nino
- Fiestas de fin de ano

Reglas duras:
- No inventes cantidad de beneficiarios, montos historicos recaudados ni nombres reales.
- Si necesitas datos no provistos, escribilos como editable pero no los presentes como hechos.
- Toda pagina debe explicar que Ojitos Felices trabaja desde Villa Gobernador Galvez y hace 15 anos acompana a familias/comunidades.
- Toda pagina debe mencionar las cuatro campanas: utiles para el colegio, ropa para el invierno, dia del nino y fiestas de fin de ano.
- Siempre incluir tres cards/bloques tipo producto o aporte con estos montos exactos:
  1. $2.500
  2. $5.000
  3. $10.000
- Cada card debe tener nombre, precio, descripcion de impacto simbolico y CTA.
- Si el tipo es tienda, usa bloques Product para esos tres aportes.
- Si el tipo es crowdfunding, tambien crea una seccion visual de aportes con esos tres montos; si Product esta disponible, usalo como cards de donacion simbolica.
- Los botones deben invitar a donar/comprar/aportar sin prometer resultados garantizados.
- La pagina debe quedar lista para demo: hero, historia breve, campanas, seccion de aportes/productos, confianza/transparencia y llamado final.
`.trim();

const DEMO_PRODUCTS = `
Cards/productos obligatorios:
- Producto 1:
  - name: "Aporte escolar"
  - price: 2500
  - description: "Ayuda a acercar utiles y materiales basicos para que chicos y chicas arranquen mejor el colegio."
  - buttonLabel: "Aportar $2.500"
- Producto 2:
  - name: "Aporte abrigo"
  - price: 5000
  - description: "Acompana la campana de ropa para el invierno con un aporte simbolico y concreto."
  - buttonLabel: "Aportar $5.000"
- Producto 3:
  - name: "Aporte celebracion"
  - price: 10000
  - description: "Suma apoyo para el dia del nino y las fiestas de fin de ano, ayudando a preparar momentos de alegria."
  - buttonLabel: "Aportar $10.000"
`.trim();

export function buildDemoCampaignPrompt({
  type,
  title,
  userPrompt
}: {
  type: CampaignType;
  title: string;
  userPrompt?: string;
}) {
  const typeInstructions =
    type === 'tienda'
      ? `
TIPO DE PAGINA: TIENDA SOLIDARIA

Construir una tienda solidaria de Ojitos Felices. La tienda debe vender/destacar aportes simbolicos con los tres productos obligatorios de $2.500, $5.000 y $10.000. Usar Product blocks para cada card si estan disponibles.
`.trim()
      : `
TIPO DE PAGINA: CROWDFUNDING

Construir una landing de crowdfunding para Ojitos Felices. Debe sentirse como una campana de recaudacion clara y confiable, con una seccion de aportes sugeridos/cards por $2.500, $5.000 y $10.000. Usar Product blocks para las cards si estan disponibles.
`.trim();

  return `
${OJITOS_FELICES_DEMO_CONTEXT}

${typeInstructions}

Titulo elegido por el usuario:
${title}

Pedido adicional del usuario:
${userPrompt?.trim() || 'No hay pedido adicional. Genera una pagina completa usando el contexto demo obligatorio.'}

${DEMO_PRODUCTS}

Instrucciones finales para el generador:
- Escribi todo en espanol rioplatense claro.
- Priorizá conversion, claridad y confianza.
- No dejes la pagina generica: tiene que decir Ojitos Felices, Villa Gobernador Galvez, Santa Fe, 15 anos y las cuatro campanas.
- Inclui exactamente los tres montos $2.500, $5.000 y $10.000 en cards visibles.
- Si usas imagenes placeholder, que sean editables y no representen hechos especificos.
`.trim();
}
