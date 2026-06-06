'use client';

import { useMemo, useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, HeartHandshake, ShoppingBag, Megaphone } from 'lucide-react';
import { createCampaignAction } from '@/app/actions';
import { slugify, type CampaignType } from '@/lib/campaigns';

const TYPES: {
  value: CampaignType;
  label: string;
  description: string;
  icon: typeof HeartHandshake;
  disabled?: boolean;
}[] = [
  {
    value: 'crowdfunding',
    label: 'Crowdfunding',
    description: 'A campaign landing page to raise money for a cause.',
    icon: HeartHandshake
  },
  {
    value: 'tienda',
    label: 'Store',
    description: 'A solidarity store to sell products or symbolic donations.',
    icon: ShoppingBag
  },
  {
    value: 'calle',
    label: 'On the street',
    description: 'A guide for volunteers fundraising in person. Coming soon.',
    icon: Megaphone,
    disabled: true
  }
];

export function CreateCampaignDialog({ subdomain }: { subdomain: string }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [type, setType] = useState<CampaignType>('crowdfunding');
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const previewSlug = useMemo(
    () => slugify(slugEdited ? slug : title),
    [slug, slugEdited, title]
  );

  function reset() {
    setStep(1);
    setTitle('');
    setSlug('');
    setSlugEdited(false);
    setType('crowdfunding');
    setPrompt('');
    setError(null);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) reset();
  }

  function goToPrompt() {
    setError(null);
    if (!title.trim()) {
      setError('Give your campaign a title.');
      return;
    }
    if (!previewSlug) {
      setError('The title must contain at least one letter or number.');
      return;
    }
    setStep(2);
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const result = await createCampaignAction(subdomain, {
        title: title.trim(),
        type,
        slug: previewSlug,
        prompt: prompt.trim()
      });
      // On success the action redirects, so we only reach here on error.
      if (result?.error) setError(result.error);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New campaign
        </Button>
      </DialogTrigger>
      <DialogContent>
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle>New campaign</DialogTitle>
              <DialogDescription>
                Choose a type and a title. We&apos;ll generate the page URL.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <div className="grid gap-2">
                  {TYPES.map((t) => {
                    const Icon = t.icon;
                    const selected = type === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        disabled={t.disabled}
                        onClick={() => setType(t.value)}
                        className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                          selected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-input hover:bg-gray-50'
                        } ${t.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <Icon className="mt-0.5 h-5 w-5 text-gray-700" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {t.label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {t.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  placeholder="Help us fund 100 school kits"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL path</Label>
                <Input
                  id="slug"
                  value={slugEdited ? slug : previewSlug}
                  placeholder="school-kits"
                  onChange={(e) => {
                    setSlugEdited(true);
                    setSlug(e.target.value);
                  }}
                />
                <p className="text-xs text-gray-500">
                  /{previewSlug || 'your-path'}
                </p>
              </div>

              {error && <div className="text-sm text-red-500">{error}</div>}
            </div>

            <DialogFooter>
              <Button onClick={goToPrompt}>Next</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Describe your campaign</DialogTitle>
              <DialogDescription>
                This prompt is sent to the AI to build your page when you open
                it.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                placeholder="Build an emotional crowdfunding page to raise $500.000 for 100 school kits. Include the story, impact tiers and a donation call to action."
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {error && <div className="text-sm text-red-500">{error}</div>}
            </div>

            <DialogFooter className="sm:justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isPending}
              >
                Back
              </Button>
              <Button onClick={submit} disabled={isPending}>
                {isPending ? 'Creating...' : 'Create campaign'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
