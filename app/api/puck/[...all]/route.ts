import { puckHandler } from '@puckeditor/cloud-client';
import { auth } from '@clerk/nextjs/server';
import { OJITOS_FELICES_DEMO_CONTEXT } from '@/lib/demo-campaign-prompt';

const handleRequest = async (request: Request) => {
  const { userId } = await auth();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }
  return puckHandler(request, {
    ai: {
      context: `
You build fundraising pages for non-profit organizations (NGOs) in Argentina and Latin America.
Write in warm, clear, trustworthy Rioplatense Spanish.
Use the available blocks to compose conversion-focused crowdfunding campaigns and solidarity stores.
Available blocks include Hero, Heading, Text, Button, Image, Product and Spacer.
Always connect every donation ask to concrete impact.
Never invent hard data such as amounts raised, beneficiary counts or real names.

${OJITOS_FELICES_DEMO_CONTEXT}

For this demo, if the user request is vague, incomplete, or missing backend/onboarding data, use the Ojitos Felices demo context above as mandatory source material. Campaign/store pages must include visible cards/products for exactly $2.500, $5.000 and $10.000.
`.trim()
    }
  });
};

export const DELETE = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
