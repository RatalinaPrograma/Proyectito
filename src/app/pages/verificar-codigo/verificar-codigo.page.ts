import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verificar-codigo',
  templateUrl: './verificar-codigo.page.html',
  styleUrls: ['./verificar-codigo.page.scss'],
})
export class VerificarCodigoPage {

  codigoIngresado: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Verifica si el código de verificación existe en localStorage
    const storedCode = localStorage.getItem('codigoVerificacion');
    const recoveryEmail = localStorage.getItem('recoveryEmail');

    if (!storedCode || !recoveryEmail) {
      alert('No se encontró una solicitud de recuperación de contraseña.');
      this.router.navigate(['/recuperar-contrasena']);
    }
  }

  verificarCodigo() {
    const storedCode = localStorage.getItem('codigoVerificacion');

    if (this.codigoIngresado === storedCode) {
      // Si el código es correcto, redirige a la página de restablecimiento de contraseña
      localStorage.removeItem('codigoVerificacion'); // Limpia el código de verificación
      this.router.navigate(['/restablecer-contrasena']);
    } else {
      alert('Código incorrecto. Intenta de nuevo.');
    }
  }
}