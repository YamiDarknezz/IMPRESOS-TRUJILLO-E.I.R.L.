import { TestBed } from '@angular/core/testing';
import { IconComponent } from './icon.component';

describe('IconComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [IconComponent] });
  });

  it('dibuja un <svg> con el tamaño por defecto (16)', () => {
    const fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('name', 'package');
    fixture.detectChanges();

    const svg = (fixture.nativeElement as HTMLElement).querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('width')).toBe('16');
    expect(svg?.getAttribute('height')).toBe('16');
    expect(svg?.getAttribute('stroke-width')).toBe('2');
  });

  it('respeta el tamaño y grosor de trazo personalizados', () => {
    const fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('name', 'users');
    fixture.componentRef.setInput('size', 24);
    fixture.componentRef.setInput('strokeWidth', 1.5);
    fixture.detectChanges();

    const svg = (fixture.nativeElement as HTMLElement).querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('24');
    expect(svg?.getAttribute('stroke-width')).toBe('1.5');
  });

  it('dibuja contenido distinto según el icono pedido', () => {
    const fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('name', 'trash');
    fixture.detectChanges();
    const trazoBasura = (fixture.nativeElement as HTMLElement).querySelector('svg')!.innerHTML;

    fixture.componentRef.setInput('name', 'lock');
    fixture.detectChanges();
    const trazoCandado = (fixture.nativeElement as HTMLElement).querySelector('svg')!.innerHTML;

    expect(trazoBasura).not.toBe(trazoCandado);
  });
});
