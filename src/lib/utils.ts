import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { siteConfig } from '@/lib/config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
}

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

export function truncateText(inputText: string, maxLength: number): string {
  return inputText.length > maxLength
    ? inputText.slice(0, maxLength) + '...'
    : inputText;
}
