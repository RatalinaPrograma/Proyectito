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
    private alertasb: AlertasService, // Servicio de alertas para mostrar mensajes
  ) {}

  ngOnInit() {}




  async insertarUsuarioInicial() {
    try {
      await this.servicebd.insertarUsuarioPredeterminado();
      console.log('Usuario inicial insertado o ya existente.');
    } catch (error) {
      console.error('Error al insertar usuario inicial:', error);
      await this.alertasb.presentAlert('Error', 'No se pudo insertar el usuario inicial.');
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

    const usuario = await this.servicebd.login(this.rut, this.password);
    if (usuario) {
      
      // Redirige según el rol del usuario
      switch (usuario.idRol) {
        case 1: // Administrador
          this.router.navigate(['/home']);
          break;
        case 2: // Paramédico
          this.router.navigate(['/home']);
          break;
        case 3: // Médico
          this.router.navigate(['/vista-medico']);
          break;
        default:
          this.alertasb.presentAlert('Error', 'Rol no reconocido.');
          break;
      }

      const LSusuario = {
        rut: usuario.rut,
        idPersona: usuario.idPersona,
        usuario: usuario.nombre,
        rol: usuario.idRol,
      }
      localStorage.setItem('usuario', JSON.stringify(LSusuario));

      // const usuarioData = localStorage.getItem('usuario');
      // if (usuarioData) {
      //   JSON.parse(usuarioData);
      // }
    } else {
      this.alertasb.presentAlert('Error de inicio de sesión', 'Rut o contraseña incorrectos.');
    }
  }
}
