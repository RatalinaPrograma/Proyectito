import { Component } from '@angular/core';
import { AlertasService } from '../services/alertas.service';
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
    idRol: 2, // Rol por defecto
  };
  coincidenContrasenas: boolean = true; // Cambiado para evitar la ñ

  constructor(
    private serviciobd: ServiciobdService,
    private alertasService: AlertasService
  ) {}

  async onRegister() {
    const mensajeError = this.validarFormulario();
    if (mensajeError) {
      this.alertasService.presentAlert('Error en registro', mensajeError);
      return;
    }

    const registrado = await this.serviciobd.register(this.persona);
    const mensaje = registrado
      ? 'Usuario registrado correctamente.'
      : 'Hubo un error en el registro.';
    const titulo = registrado ? 'Registro exitoso' : 'Error en registro';

    this.alertasService.presentAlert(titulo, mensaje);

    if (registrado) {
      this.resetFormulario();
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

    if (!/^[0-9]+[-][0-9kK]{1}$/.test(this.persona.rut)) {
      return 'El formato del RUT es inválido.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.persona.correo)) {
      return 'Formato de correo electrónico inválido.';
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/.test(this.persona.clave)) {
      return 'La contraseña debe tener al menos 6 caracteres, con mayúsculas, minúsculas y un carácter especial.';
    }

    if (this.persona.clave !== this.persona.confirmarClave) {
      this.coincidenContrasenas = false;
      return 'Las contraseñas no coinciden.';
    }

    if (!/^\+569[0-9]{8}$/.test(this.persona.telefono)) {
      return 'El teléfono debe seguir el formato +569XXXXXXXX.';
    }

    this.coincidenContrasenas = true;
    return ''; 
  }

  prellenarPrefijo() {
    if (!this.persona.telefono.startsWith('+569')) {
      this.persona.telefono = '+569';
    }
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
  }
}
