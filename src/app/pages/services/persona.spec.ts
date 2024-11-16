import { Persona } from './persona';

describe('Persona', () => {
  it('should create an instance', () => {
    expect(new Persona('Juan', 'Pérez', '12345678-9', 'juan@example.com', 'clave', '+56912345678', 1)).toBeTruthy();

  });
});
