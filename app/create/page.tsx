import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { OrgChooser } from './org-chooser';

export const metadata: Metadata = {
  title: 'Tu organización · OpenONG',
  description:
    'Elegí tu organización o creá una nueva en OpenONG y empezá a montar tus canales de financiación con IA.'
};

export default async function CreatePage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-up');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <OrgChooser />
    </div>
  );
}
