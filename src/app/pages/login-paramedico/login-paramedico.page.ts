import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ServiciobdService } from '../services/serviciobd.service';
import { AlertasService } from '../services/alertas.service';

@Component({
  selector: 'app-login-paramedico',
  templateUrl: './login-paramedico.page.html',
  styleUrls: ['./login-paramedico.page.scss'],
})
export class LoginParamedicoPage {
  rut: string = '';
  password: string = '';

  constructor(
    private alertController: AlertController,
    private router: Router,
    private servicebd: ServiciobdService,
    private alertasb: AlertasService
  ) {}

  ngOnInit() {}

  // Método para insertar usuario inicial
  async insertarUsuarioInicial() {
    try {
      await this.servicebd.insertarUsuarioPredeterminado();
      console.log('Usuario inicial insertado o ya existente.');
    } catch (error) {
      console.error('Error al insertar usuario inicial:', error);
    }
  }

  // Método para validar los campos de login
  validarLogin(): string {
    if (!this.rut || !this.password) {
      return 'Por favor ingrese su Rut y contraseña.';
    }

    const rutValido = /^[0-9]+[-][0-9kK]{1}$/.test(this.rut);
    if (!rutValido) {
      return 'El formato del RUT es inválido.';
    }

    return '';
  }

  // Método para iniciar sesión
  async login() {
    const mensajeError = this.validarLogin();
    if (mensajeError) {
      this.alertasb.presentAlert('Error', mensajeError);
      return;
    }
  
    try {
      // Llama al método de login en el servicio
      const usuario = await this.servicebd.login(this.rut, this.password);
  
      // Registra el valor de usuario para depuración
      console.log('Resultado del login:', usuario);
  
      // Validar si el usuario retornado es válido
      if (usuario && typeof usuario === 'object') {
        console.log('Usuario encontrado:', usuario);
  
        // Guardar información del usuario en localStorage
        const LSusuario = {
          rut: usuario.rut,
          idPersona: usuario.idPersona || null,
          usuario: usuario.nombres || '',
          rol: usuario.idRol || 0,
        };
        localStorage.setItem('usuario', JSON.stringify(LSusuario));
  
        // Redirige al home correspondiente
        await this.router.navigate(['/home']);
        console.log('Redirección exitosa a /home');
      } else {
        console.error('Usuario inválido o no encontrado:', usuario);
        this.alertasb.presentAlert(
          'Error de inicio de sesión',
          'Rut o contraseña incorrectos.'
        );
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      this.alertasb.presentAlert(
        'Error',
        'Ocurrió un error inesperado durante el inicio de sesión.'
      );
    }
  }
  
}
