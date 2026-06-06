import { puckHandler } from '@puckeditor/cloud-client';

const handleRequest = (request: Request) => {
  return puckHandler(request, {
    ai: {
      context:
        'You build fundraising pages for non-profit organizations (NGOs) in Argentina and Latin America. Write in warm, clear, trustworthy Rioplatense Spanish. Use the available blocks (Hero, Heading, Text, Button, Image, Spacer) to compose emotional, conversion-focused crowdfunding campaigns and solidarity stores. Always connect every donation ask to its concrete impact. Never invent hard data (amounts raised, beneficiary counts, real names): use editable placeholders.'
    }
  });
};

export const DELETE = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
