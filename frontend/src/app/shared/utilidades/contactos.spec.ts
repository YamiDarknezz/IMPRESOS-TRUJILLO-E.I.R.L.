import { celularPeruano } from './contactos';

describe('celularPeruano', () => {
  it('reconoce el mismo celular con código de país o espacios', () => {
    expect(celularPeruano('+51 975 085 405')).toBe('+51975085405');
    expect(celularPeruano('975 085 405')).toBe('+51975085405');
    expect(celularPeruano('975085405')).toBe('+51975085405');
  });

  it('no confunde usuarios de WhatsApp ni nombres con números', () => {
    expect(celularPeruano('@anaa91s')).toBeNull();
    expect(celularPeruano('Ana 975085405')).toBeNull();
    expect(celularPeruano('12345678')).toBeNull();
  });
});
