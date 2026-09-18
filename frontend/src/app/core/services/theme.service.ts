import { Injectable, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'it-theme';
  readonly theme = signal<Theme>(this.resolveInitial());

  constructor() {
    this.apply(this.theme());
  }

  toggle() {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    try { localStorage.setItem(this.storageKey, next); } catch { }
    this.apply(next);
  }

  private resolveInitial(): Theme {
    let saved: string | null = null;
    try { saved = localStorage.getItem(this.storageKey); } catch { }
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private apply(t: Theme) {
    document.documentElement.setAttribute('data-theme', t);
  }
}
