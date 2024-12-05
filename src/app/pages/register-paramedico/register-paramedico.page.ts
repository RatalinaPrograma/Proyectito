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
    const mensajeError = this.validarFormulario();
    if (mensajeError) {
      this.alertasService.presentAlert('Error en registro', mensajeError);
      this.limpiarCampoConError(mensajeError);
      return;
    }

    try {
      const registrado = await this.serviciobd.register(this.persona);
      if (registrado) {
        this.alertasService.presentAlert('Registro exitoso', 'Usuario registrado correctamente.');
        this.resetFormulario();
        this.irLogin();
      } else {
        this.alertasService.presentAlert('Error en registro', 'El usuario ya está registrado.');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      this.alertasService.presentAlert('Error', 'Ocurrió un problema al registrar el usuario.');
    }
  }

  private validarFormulario(): string {
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
  
    const soloLetrasYEspacios = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (this.persona.nombres.length < 2 || !soloLetrasYEspacios.test(this.persona.nombres)) {
      return 'El nombre debe tener al menos 2 caracteres y solo contener letras y espacios.';
    }
  
    if (this.persona.apellidos.length < 2 || !soloLetrasYEspacios.test(this.persona.apellidos)) {
      return 'El apellido debe tener al menos 2 caracteres y solo contener letras y espacios.';
    }
  
    const rutNormalizado = this.serviciobd.normalizarRut(this.persona.rut);
    if (!this.serviciobd.validarRutCompleto(rutNormalizado)) {
      return 'El RUT ingresado es inválido.';
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.persona.correo)) {
      return 'Formato de correo electrónico inválido.';
    }
  
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/.test(this.persona.clave)) {
      return 'La contraseña debe tener al menos 6 caracteres, con mayúsculas, minúsculas y un carácter especial.';
    }
  
    if (!this.verificarCoincidenciaContrasenas()) {
      return 'Las contraseñas no coinciden.';
    }
  
    if (!/^\+569[0-9]{8}$/.test(this.persona.telefono)) {
      return 'El teléfono debe seguir el formato +569XXXXXXXX.';
    }
  
    return '';
  }
  
  verificarCoincidenciaContrasenas(): boolean {
    this.coincidenContrasenas = this.persona.clave === this.persona.confirmarClave;
    return this.coincidenContrasenas;
  }

  private limpiarCampoConError(mensajeError: string) {
    if (mensajeError.includes('nombre')) this.persona.nombres = '';
    else if (mensajeError.includes('apellido')) this.persona.apellidos = '';
    else if (mensajeError.includes('RUT')) this.persona.rut = '';
    else if (mensajeError.includes('correo')) this.persona.correo = '';
    else if (mensajeError.includes('contraseña')) {
      this.persona.clave = '';
      this.persona.confirmarClave = '';
    } else if (mensajeError.includes('teléfono')) this.persona.telefono = '+569';
  }

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
      idRol: 2,
    };
    this.coincidenContrasenas = true;
  }

  async irLogin() {
    await this.router.navigate(['/login-paramedico']);
  }
}
