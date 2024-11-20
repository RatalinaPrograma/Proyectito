export class Confirmacion {
  idConfirmacion?: number; 
  idEmerg: number;
  idPersona: number | string;
  fecha_confirmacion: Date;
  estado_confirmacion: boolean;

  constructor(idEmerg: number, idPersona: number | string, estado_confirmacion: boolean) {
    this.idEmerg = idEmerg;
    this.idPersona = idPersona;
    this.fecha_confirmacion = new Date();
    this.estado_confirmacion = estado_confirmacion;
  }
}
