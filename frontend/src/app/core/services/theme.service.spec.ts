import { ThemeService } from './theme.service';

function mockMatchMedia(prefiereOscuro: boolean) {
  // jsdom no implementa matchMedia: se define directamente en vez de espiarlo.
  window.matchMedia = vi.fn().mockReturnValue({ matches: prefiereOscuro } as MediaQueryList);
}

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('usa el tema guardado si existe, sin mirar preferencia del sistema', () => {
    localStorage.setItem('it-theme', 'dark');
    mockMatchMedia(false);

    const theme = new ThemeService();

    expect(theme.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('si no hay tema guardado, usa la preferencia del sistema (oscuro)', () => {
    mockMatchMedia(true);

    const theme = new ThemeService();

    expect(theme.theme()).toBe('dark');
  });

  it('si no hay tema guardado, usa la preferencia del sistema (claro)', () => {
    mockMatchMedia(false);

    const theme = new ThemeService();

    expect(theme.theme()).toBe('light');
  });

  it('toggle() alterna el tema, lo persiste y actualiza el DOM', () => {
    mockMatchMedia(false);
    const theme = new ThemeService();
    expect(theme.theme()).toBe('light');

    theme.toggle();

    expect(theme.theme()).toBe('dark');
    expect(localStorage.getItem('it-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    theme.toggle();

    expect(theme.theme()).toBe('light');
    expect(localStorage.getItem('it-theme')).toBe('light');
  });

  it('no lanza si localStorage no está disponible', () => {
    mockMatchMedia(false);
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });

    const theme = new ThemeService();
    expect(() => theme.toggle()).not.toThrow();

    spy.mockRestore();
  });
});
