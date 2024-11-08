// emergencia.model.ts
export class Emergencia {
    idEmerg?: number; // Opcional, porque se generará automáticamente
    fecha_emer: Date;
    motivo: string;
    desc_motivo: string;
    observaciones: string;
    estado: string;
    f_recepcion: Date;
    idambulancia: number;
    idTriage: number;
    idHospital: number;
  
    constructor(
      fecha_emer: Date,
      motivo: string,
      desc_motivo: string,
      observaciones: string,
      estado: string,
      f_recepcion: Date,
      idambulancia: number,
      idTriage: number,
      idHospital: number
    ) {
      this.fecha_emer = fecha_emer;
      this.motivo = motivo;
      this.desc_motivo = desc_motivo;
      this.observaciones = observaciones;
      this.estado = estado;
      this.f_recepcion = f_recepcion;
      this.idambulancia = idambulancia;
      this.idTriage = idTriage;
      this.idHospital = idHospital;
    }
  }
  