'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ChatAttachment,
  OnboardingSession
} from '@/lib/onboarding/types';

type Status = 'idle' | 'loading' | 'ready' | 'error';

export type UseOnboarding = ReturnType<typeof useOnboarding>;

const STORAGE_KEY = 'onboarding:sessionId';

/**
 * Client state machine for the onboarding chat.
 * Owns the session, message sending, attachment upload and completion.
 * Resilient: persists the sessionId in localStorage so a refresh resumes.
 */
export function useOnboarding(subdomain?: string) {
  const [session, setSession] = useState<OnboardingSession | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);

  const loadSession = useCallback(async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/onboarding/session/${id}`);
    if (!res.ok) return false;
    const data = await res.json();
    setSession(data.session);
    return true;
  }, []);

  const createSession = useCallback(async () => {
    const res = await fetch('/api/onboarding/session', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ subdomain })
    });
    if (!res.ok) throw new Error('No se pudo crear la sesión de onboarding');
    const data = await res.json();
    setSession(data.session);
    try {
      localStorage.setItem(STORAGE_KEY, data.session.id);
    } catch {
      /* ignore storage errors */
    }
  }, [subdomain]);

  // Bootstrap: resume stored session or create a new one.
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    (async () => {
      setStatus('loading');
      try {
        let resumed = false;
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) resumed = await loadSession(stored);
        } catch {
          /* ignore */
        }
        if (!resumed) await createSession();
        setStatus('ready');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconocido');
        setStatus('error');
      }
    })();
  }, [createSession, loadSession]);

  const uploadFile = useCallback(
    async (file: File): Promise<ChatAttachment> => {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/files/upload', {
        method: 'POST',
        body: form
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Error al subir el archivo');
      return data.attachment as ChatAttachment;
    },
    []
  );

  const sendMessage = useCallback(
    async (message: string, attachments: ChatAttachment[] = []) => {
      if (!session) return;
      setSending(true);
      setError(null);

      // Optimistic: show the user's message immediately.
      const optimistic: OnboardingSession = {
        ...session,
        messages: [
          ...session.messages,
          {
            id: `tmp-${Date.now()}`,
            role: 'user',
            content: message,
            attachments: attachments.length ? attachments : undefined,
            createdAt: new Date().toISOString()
          }
        ]
      };
      setSession(optimistic);

      try {
        const res = await fetch('/api/onboarding/message', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sessionId: session.id, message, attachments })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Error al enviar el mensaje');
        setSession(data.session);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al enviar');
        // Roll back the optimistic message.
        setSession(session);
      } finally {
        setSending(false);
      }
    },
    [session]
  );

  const complete = useCallback(
    async (force = false) => {
      if (!session) return;
      setError(null);
      try {
        const res = await fetch('/api/onboarding/complete', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sessionId: session.id, force })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data.error ?? 'Todavía faltan datos mínimos para finalizar'
          );
        }
        setSession(data.session);
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al finalizar');
        return false;
      }
    },
    [session]
  );

  const reset = useCallback(async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setSession(null);
    initialized.current = false;
    setStatus('loading');
    await createSession();
    setStatus('ready');
  }, [createSession]);

  return {
    session,
    status,
    sending,
    error,
    sendMessage,
    uploadFile,
    complete,
    reset
  };
}
