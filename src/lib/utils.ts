import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIsoDate(isoDate: string): string {
  return format(new Date(isoDate), 'MMM dd, yyyy');
}

export function formatDateAndTime(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, 'MMM d, yyyy, h:mm a');
}

export function formatCentsToDollars(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}
