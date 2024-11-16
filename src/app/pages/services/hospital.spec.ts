import { Hospital } from "./hospital";

describe('Hospital', () => {
  it('should create an instance', () => {
    const hospital = new Hospital(1, 'Hospital Name', 'Hospital Address');
    expect(hospital).toBeTruthy(); // Verifica que se haya creado
  });

  it('should assign values to properties', () => {
    const hospital = new Hospital(1, 'Hospital Name', 'Hospital Address');
    expect(hospital.idHospital).toEqual(1);
    expect(hospital.nombre).toEqual('Hospital Name');
    expect(hospital.direccion).toEqual('Hospital Address');
  });
});
