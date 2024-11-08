// persona.model.ts
export class Persona {
    idPersona?: number; 
    nombres: string;
    apellidos: string;
    rut: string;
    correo: string;
    clave: string;
    telefono: string;
    foto?: Blob;
    idRol: number;
  
    constructor(
      nombres: string,
      apellidos: string,
      rut: string,
      correo: string,
      clave: string,
      telefono: string,
      idRol: number,
      foto?: Blob
    ) {
      this.nombres = nombres;
      this.apellidos = apellidos;
      this.rut = rut;
      this.correo = correo;
      this.clave = clave;
      this.telefono = telefono;
      this.idRol = idRol;
      this.foto = foto;
    }
  }
  