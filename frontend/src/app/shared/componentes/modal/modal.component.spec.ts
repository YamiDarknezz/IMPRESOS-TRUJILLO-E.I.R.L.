import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

@Component({
  standalone: true,
  imports: [ModalComponent],
  template: `
    <button id="abre" (click)="abierto.set(true)">Abrir</button>
    @if (abierto()) {
      <app-modal titulo="Confirmar pago" [conBotonCerrar]="conX()" [cerrarAlClicFuera]="cierraFuera()"
                 (cerrar)="cerrados = cerrados + 1; abierto.set(false)">
        @if (conCampos()) {
          <input id="primero">
          <button id="ultimo" type="button">Aceptar</button>
        } @else {
          <p>Solo texto</p>
        }
      </app-modal>
    }
  `,
})
class AnfitrionComponent {
  abierto = signal(false);
  conX = signal(false);
  conCampos = signal(true);
  cierraFuera = signal(true);
  cerrados = 0;
}

describe('ModalComponent (#38)', () => {
  let fixture: ComponentFixture<AnfitrionComponent>;
  let anfitrion: AnfitrionComponent;
  const el = (selector: string) => fixture.nativeElement.querySelector(selector) as HTMLElement;
  const pulsar = (key: string, opciones: KeyboardEventInit = {}) =>
    document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...opciones }));

  async function abrir(): Promise<void> {
    el('#abre').focus();
    el('#abre').click();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AnfitrionComponent] });
    fixture = TestBed.createComponent(AnfitrionComponent);
    anfitrion = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('se anuncia como diálogo modal, nombrado por su título', async () => {
    await abrir();
    const dialogo = el('[role="dialog"]');
    expect(dialogo.getAttribute('aria-modal')).toBe('true');
    const titulo = el(`#${dialogo.getAttribute('aria-labelledby')}`);
    expect(titulo.textContent).toContain('Confirmar pago');
  });

  it('Escape lo cierra', async () => {
    await abrir();
    pulsar('Escape');
    fixture.detectChanges();
    expect(anfitrion.cerrados).toBe(1);
    expect(el('[role="dialog"]')).toBeNull();
  });

  it('con dos diálogos apilados, Escape cierra solo el de encima', async () => {
    const segundo = TestBed.createComponent(AnfitrionComponent);
    segundo.componentInstance.abierto.set(true);
    segundo.detectChanges();
    await abrir(); // el primero (el fixture principal) se abre después: queda encima

    pulsar('Escape');
    fixture.detectChanges();
    segundo.detectChanges();

    expect(anfitrion.cerrados).toBe(1);
    expect(segundo.componentInstance.cerrados).toBe(0);
  });

  it('al abrir, mueve el foco al primer control', async () => {
    anfitrion.conX.set(true);
    await abrir();
    expect(document.activeElement).toBe(el('#primero'));
  });

  it('sin controles, el foco queda en el propio diálogo', async () => {
    anfitrion.conCampos.set(false);
    await abrir();
    expect(document.activeElement).toBe(el('[role="dialog"]'));
  });

  it('con solo el botón ✕ como control, el foco va al ✕', async () => {
    anfitrion.conCampos.set(false);
    anfitrion.conX.set(true);
    await abrir();
    expect(document.activeElement).toBe(el('.modal-cerrar'));
  });

  it('Tab desde el último control vuelve al primero, y Mayús+Tab hace lo contrario', async () => {
    await abrir();
    const dialogo = el('[role="dialog"]');

    el('#ultimo').focus();
    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    el('#ultimo').dispatchEvent(tab);
    expect(tab.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(el('#primero'));

    const mayusTab = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true });
    el('#primero').dispatchEvent(mayusTab);
    expect(mayusTab.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(el('#ultimo'));
    expect(dialogo.contains(document.activeElement)).toBe(true);
  });

  it('Tab entre controles intermedios no se intercepta', async () => {
    await abrir();
    el('#primero').focus();
    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    el('#primero').dispatchEvent(tab);
    expect(tab.defaultPrevented).toBe(false);
  });

  it('al cerrar, devuelve el foco al botón que lo abrió', async () => {
    await abrir();
    expect(document.activeElement).toBe(el('#primero'));

    pulsar('Escape');
    fixture.detectChanges();

    expect(document.activeElement).toBe(el('#abre'));
  });

  describe('clic en el fondo', () => {
    it('cierra por defecto, pero no un clic dentro del diálogo', async () => {
      await abrir();
      el('.modal-content').click();
      expect(anfitrion.cerrados).toBe(0);

      el('.modal-overlay').click();
      expect(anfitrion.cerrados).toBe(1);
    });

    it('no cierra si el formulario lo pide con cerrarAlClicFuera=false', async () => {
      anfitrion.cierraFuera.set(false);
      await abrir();
      el('.modal-overlay').click();
      expect(anfitrion.cerrados).toBe(0);
      expect(el('[role="dialog"]')).not.toBeNull();
    });
  });

  it('el botón ✕ solo aparece si se pide, y cierra', async () => {
    await abrir();
    expect(el('.modal-cerrar')).toBeNull();
    pulsar('Escape');
    fixture.detectChanges();

    anfitrion.conX.set(true);
    await abrir();
    expect(el('.modal-cerrar').getAttribute('aria-label')).toBe('Cerrar');
    el('.modal-cerrar').click();
    expect(anfitrion.cerrados).toBe(2);
  });
});
