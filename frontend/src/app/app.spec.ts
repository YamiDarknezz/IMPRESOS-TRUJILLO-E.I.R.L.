import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('se crea el componente raíz', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('monta el router-outlet donde se dibujan las pantallas', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const elemento = fixture.nativeElement as HTMLElement;
    expect(elemento.querySelector('router-outlet')).toBeTruthy();
  });
});
