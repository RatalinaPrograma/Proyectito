import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { AlertasService } from '../services/alertas.service';
import { ServiciobdService } from '../services/serviciobd.service';

@Component({
  selector: 'app-olvido',
  templateUrl: './olvido.page.html',
  styleUrls: ['./olvido.page.scss'],
})
export class OlvidoPage implements OnInit {
  email: string = '';
  rut: string = '';
  codigoVerificacion: string = '';


  constructor(
    private serviciobd: ServiciobdService,
    private alertasService: AlertasService,
    private router: Router
  ) {}
  ngOnInit(): void {
    emailjs.init('Vd0lSIF3HAI5CzP8u');
  }

  async enviarRecuperacion() {
    try {
      // Verifica si el usuario existe con RUT y correo
      const usuario = await this.serviciobd.obtenerUsuarioPorCorreoYRut(this.email, this.rut);
      if (!usuario) {
        await this.alertasService.presentAlert('Error', 'RUT o correo no registrado.');
        return;
      }

      // Genera un código de verificación de 6 dígitos
      const codigoVerificacion = Math.floor(100000 + Math.random() * 900000).toString();

      // Guarda en localStorage
      localStorage.setItem('idPersonaRecuperacion', usuario.idPersona.toString());
      localStorage.setItem('recoveryEmail', this.email);
      localStorage.setItem('codigoVerificacion', codigoVerificacion);

      // Configura los parámetros de EmailJS
      const templateParams = {
        to_email: this.email,  // Envía el correo al email ingresado por el usuario
        verification_code: codigoVerificacion,
      };

      // Inicializa y envía el correo de verificación
      emailjs.init('Vd0lSIF3HAI5CzP8u'); // Reemplaza con tu USER_ID
      await emailjs.send('service_pulsetrack', 'pulsetracktemplate', templateParams);

      // Redirige si todo es correcto
      await this.alertasService.presentAlert('Éxito', 'Código de verificación enviado. Revisa tu correo.');
      this.router.navigate(['/verificar-codigo']);
    } catch (error) {
      await this.alertasService.presentAlert('Error', 'No se pudo enviar el código de verificación. Intenta nuevamente.');
    }
  }

}  