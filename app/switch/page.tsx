'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function SwitchPage() {
  useEffect(() => {
    window.location.replace('/admin');
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center text-gray-400">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
}
