
import type { LucideIcon } from 'lucide-react';

export type Page = 'home' | 'whisk' | 'veo' | 'account';

export interface NavItemType {
  id: Page;
  label: string;
  icon: LucideIcon;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
}

export interface VideoJob {
  jobId: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  video?: {
    url: string;
  };
}
