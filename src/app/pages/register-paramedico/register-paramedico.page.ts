import { Component } from '@angular/core';
import { AlertasService } from '../services/alertas.service';
import { Router } from '@angular/router';
import { ServiciobdService } from '../services/serviciobd.service';

@Component({
  selector: 'app-register-paramedico',
  templateUrl: './register-paramedico.page.html',
  styleUrls: ['./register-paramedico.page.scss'],
})
export class RegisterParamedicoPage {
  persona = {
    nombres: '',
    apellidos: '',
    rut: '',
    correo: '',
    clave: '',
    confirmarClave: '',
    telefono: '+569',
    foto: '',
    idRol: 2, // Rol por defecto para el paramédico
  };
  coincidenContrasenas: boolean = true;

  constructor(
    private alertasService: AlertasService,
    private router: Router,
    private serviciobd: ServiciobdService
  ) {}

  async onRegister() {
    // Valida el formulario antes de proceder al registro
    const mensajeError = this.validarFormulario();
    if (mensajeError) {
      this.alertasService.presentAlert('Error en registro', mensajeError);
      this.limpiarCampoConError(mensajeError); // Borra el campo específico con error
      return; // Detiene la ejecución para evitar redireccionar al login
    }
  
    // Realiza el registro en la base de datos
    const registrado = await this.serviciobd.register(this.persona);
    if (registrado) {
      this.alertasService.presentAlert('Registro exitoso', 'Usuario registrado correctamente.');
      this.resetFormulario(); // Limpia el formulario después de un registro exitoso
      this.irLogin(); // Redirige al login después del registro exitoso
    } else {
      console.error('Error en registro', 'Este usuario ya está registrado.');
      this.resetFormulario(); // Limpia todos los datos si el usuario ya está registrado
    }
  }
  
  private validarFormulario(): string {
    // Validación de campos vacíos
    if (
      !this.persona.nombres ||
      !this.persona.apellidos ||
      !this.persona.rut ||
      !this.persona.correo ||
      !this.persona.clave ||
      !this.persona.confirmarClave ||
      !this.persona.telefono
    ) {
      return 'Todos los campos son obligatorios.';
    }

    // Validación de nombres y apellidos (solo letras y espacios, mínimo 2 caracteres)
    const soloLetrasYEspacios = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (this.persona.nombres.length < 2 || !soloLetrasYEspacios.test(this.persona.nombres)) {
      return 'El nombre debe tener al menos 2 caracteres y solo puede contener letras y espacios.';
    }

    if (this.persona.apellidos.length < 2 || !soloLetrasYEspacios.test(this.persona.apellidos)) {
      return 'El apellido debe tener al menos 2 caracteres y solo puede contener letras y espacios.';
    }

    // Validación del RUT
    if (!this.validarRut(this.persona.rut)) {
      return 'El RUT ingresado es inválido.';
    }

    // Validación del correo electrónico
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.persona.correo)) {
      return 'Formato de correo electrónico inválido.';
    }

    // Validación de la contraseña
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/.test(this.persona.clave)) {
      return 'La contraseña debe tener al menos 6 caracteres, con mayúsculas, minúsculas y un carácter especial.';
    }

    // Validación de coincidencia de contraseñas
    if (!this.verificarCoincidenciaContrasenas()) {
      return 'Las contraseñas no coinciden.';
    }

    // Validación del formato del teléfono
    if (!/^\+569[0-9]{8}$/.test(this.persona.telefono)) {
      return 'El teléfono debe seguir el formato +569XXXXXXXX.';
    }

    return ''; // Todas las validaciones pasaron
  }

  private validarRut(rut: string): boolean {
    const rutLimpio = rut.replace(/\./g, '').replace('-', '').trim();

    if (rutLimpio.length < 8 || rutLimpio.length > 9) {
      console.log('RUT inválido: longitud incorrecta');
      return false;
    }

    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();

    if (!/^[0-9]+$/.test(cuerpo)) {
      console.log('RUT inválido: el cuerpo contiene caracteres no numéricos');
      return false;
    }

    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

    if (dv !== dvCalculado) {
      console.log(`RUT inválido: dígito verificador no coincide (esperado: ${dvCalculado}, obtenido: ${dv})`);
      return false;
    }

    return true;
  }

  // Verifica si las contraseñas coinciden
  public verificarCoincidenciaContrasenas(): boolean {
    this.coincidenContrasenas = this.persona.clave === this.persona.confirmarClave;
    return this.coincidenContrasenas;
  }

  // Añade el prefijo +569 si no está presente
  prellenarPrefijo() {
    if (!this.persona.telefono.startsWith('+569')) {
      this.persona.telefono = '+569';
    }
  }

  // Limpia campos específicos según el mensaje de error
  private limpiarCampoConError(mensajeError: string) {
    if (mensajeError.includes('nombre')) {
      this.persona.nombres = '';
    } else if (mensajeError.includes('apellido')) {
      this.persona.apellidos = '';
    } else if (mensajeError.includes('RUT')) {
      this.persona.rut = '';
    } else if (mensajeError.includes('correo')) {
      this.persona.correo = '';
    } else if (mensajeError.includes('contraseña')) {
      this.persona.clave = '';
      this.persona.confirmarClave = '';
    } else if (mensajeError.includes('teléfono')) {
      this.persona.telefono = '+569';
    }
  }

  // Reinicia el formulario y el estado de validación de las contraseñas
  private resetFormulario() {
    this.persona = {
      nombres: '',
      apellidos: '',
      rut: '',
      correo: '',
      clave: '',
      confirmarClave: '',
      telefono: '+569',
      foto: '',
      idRol: 2, // Rol predeterminado
    };
    this.coincidenContrasenas = true;
  }

  // Redirige al login solo si el registro es exitoso
  async irLogin() {
    this.router.navigate(['/login-paramedico']);
  }
}
