'use client';

import { useCallback, useMemo, useRef } from 'react';
import { Check, Loader2, Save, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ONBOARDING_QUESTIONS } from '@/lib/onboarding/questions';
import { cn } from '@/lib/utils';
import { useOnboarding } from './use-onboarding';
import { ChatPanel } from './chat-panel';
import { ChatInput } from './chat-input';
import { ProfileSummary } from './profile-summary';
import { VoicePanel } from './voice-panel';

const TOTAL_QUESTIONS = ONBOARDING_QUESTIONS.length;

export function OnboardingExperience({
  voiceEnabled,
  voiceAgentId,
  subdomain
}: {
  voiceEnabled: boolean;
  voiceAgentId?: string;
  subdomain?: string;
}) {
  const {
    session,
    status,
    sending,
    error,
    sendMessage,
    uploadFile,
    complete,
    reset
  } = useOnboarding(subdomain);

  const answeredCount = session ? Object.keys(session.answers).length : 0;
  const progress = useMemo(
    () => Math.min(100, Math.round((answeredCount / TOTAL_QUESTIONS) * 100)),
    [answeredCount]
  );

  const isCompleted = session?.status === 'completed';

  const finishedRef = useRef(false);
  const finalizeAndGo = useCallback(async () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    let ok = false;
    try {
      ok = (await complete(false)) ?? false;
    } finally {
      if (!ok) finishedRef.current = false;
    }
    if (ok) window.location.href = '/admin';
  }, [complete]);

  if (status === 'loading' || !session) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 size-5 animate-spin" /> Preparando tu
        onboarding…
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-destructive">{error ?? 'Algo salió mal'}</p>
        <Button onClick={() => reset()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <header className="mb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Conocé tu ONG</h1>
            <p className="text-sm text-muted-foreground">
              Respondé algunas preguntas y generamos tu kit inicial de
              recaudación.
            </p>
          </div>
          <StatusBadge completed={isCompleted} />
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>Progreso</span>
            <span>
              {answeredCount} / {TOTAL_QUESTIONS} preguntas
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* Conversation */}
        <div className="flex h-[68vh] flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
          <ChatPanel messages={session.messages} sending={sending} />
          {error && (
            <p className="border-t bg-destructive/10 px-4 py-2 text-xs text-destructive">
              {error}
            </p>
          )}
          <ChatInput
            disabled={isCompleted}
            sending={sending}
            onSend={sendMessage}
            uploadFile={uploadFile}
          />
        </div>

        {/* Sidebar: live summary + voice + actions */}
        <aside className="flex flex-col gap-4">
          <VoicePanel
            enabled={voiceEnabled}
            agentId={voiceAgentId}
            sessionId={session.id}
          />

          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h2 className="text-sm font-semibold">Resumen detectado</h2>
            </div>
            <ProfileSummary session={session} />
          </div>

          <div className="flex flex-col gap-2">
            {!isCompleted ? (
              <>
                <Button
                  onClick={() => finalizeAndGo()}
                  disabled={sending}
                  className="w-full"
                >
                  <Check className="size-4" /> Finalizar onboarding
                </Button>
                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Save className="size-3.5" /> Se guarda automáticamente
                </p>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex flex-col items-center gap-1 rounded-lg border border-green-200 bg-green-50 p-3 text-center text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
                  <Loader2 className="size-5 animate-spin" />
                  Perfil listo. Te llevamos al panel de tu ONG…
                </div>
                <Button asChild variant="outline" className="w-full">
                  <a href="/admin">Ir al panel ahora</a>
                </Button>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => reset()}
              className="w-full text-muted-foreground"
            >
              <RotateCcw className="size-3.5" /> Empezar de nuevo
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StatusBadge({ completed }: { completed: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        completed
          ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          completed ? 'bg-green-600' : 'animate-pulse bg-amber-500'
        )}
      />
      {completed ? 'Perfil listo' : 'En progreso'}
    </span>
  );
}
