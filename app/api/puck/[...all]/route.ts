import { puckHandler } from '@puckeditor/cloud-client';

const handleRequest = (request: Request) => {
  return puckHandler(request, {
    ai: {
      context:
        'You build marketing landing pages for tenant websites. Use the available blocks (Hero, Heading, Text, Button, Image, Spacer) to compose clean, modern, conversion-focused pages.'
    }
  });
};

export const DELETE = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
