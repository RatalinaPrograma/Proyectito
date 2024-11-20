import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasService } from '../services/alertas.service';
import { ServiciobdService } from '../services/serviciobd.service';

@Component({
  selector: 'app-restablecer-contrasena',
  templateUrl: './restablecer-contrasena.page.html',
  styleUrls: ['./restablecer-contrasena.page.scss'],
})
export class RestablecerContrasenaPage {
  
   
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';

  constructor(
    private router: Router, 
    private alertasService: AlertasService,
    private serviciobd: ServiciobdService
  ) {}

  async restablecerContrasena() {
    // Verifica que las contraseñas coincidan
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      await this.alertasService.presentAlert('Error', 'Las contraseñas no coinciden. Intenta de nuevo.');
      return;
    }

    // Obtiene el ID de la persona de localStorage
    const idPersona = localStorage.getItem('idPersonaRecuperacion');
    if (!idPersona) {
      await this.alertasService.presentAlert('Error', 'No se pudo identificar al usuario. Intenta de nuevo.');
      return;
    }

    try {
      // Actualiza la contraseña en la base de datos
      await this.serviciobd.modificarClave(parseInt(idPersona), this.nuevaContrasena);
      
      // Limpia los datos de recuperación
      localStorage.removeItem('idPersonaRecuperacion');
      localStorage.removeItem('recoveryEmail');

      // Notifica éxito y redirige al inicio de sesión
      await this.alertasService.presentAlert('Éxito', 'Contraseña restablecida exitosamente.');
      this.router.navigate(['/login-paramedico']);
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      await this.alertasService.presentAlert('Error', 'No se pudo actualizar la contraseña. Inténtalo más tarde.');
    }
  }
}