import { Emergencia } from './emergencia';

describe('Emergencia', () => {
  it('should create an instance', () => {
    expect(new Emergencia(new Date(), 'Motivo', 'Descripción', 'Notas', 'activo', new Date(), 1, 1, 1, 1)).toBeTruthy();

  });
});
