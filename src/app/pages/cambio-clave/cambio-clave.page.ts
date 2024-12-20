import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiciobdService } from '../services/serviciobd.service';
import { AlertasService } from '../services/alertas.service';

@Component({
  selector: 'app-cambio-clave',
  templateUrl: './cambio-clave.page.html',
  styleUrls: ['./cambio-clave.page.scss'],
})
export class CambioClavePage implements OnInit {
  persona: any = {
    idPersona: 0,
    nombres: '',
    apellidos: '',
    rut: '',
    correo: '',
    telefono: '',
    foto: '',
    clave: '',
    idRol: 2,
  };
  
  claveAnterior: string = ''; // Contraseña actual ingresada por el usuario
  nuevaClave: string = ''; // Nueva contraseña
  confirmarNuevaClave: string = ''; // Confirmación de la nueva contraseña

  constructor(
    private serviciobd: ServiciobdService,
    private alertasService: AlertasService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  // Cargar datos del usuario logueado
  async cargarDatosUsuario() {
    let idPersona: number = 0;
    const usuario1 = localStorage.getItem('usuario');
    if (usuario1){
      const usuario = JSON.parse(usuario1);
      idPersona = usuario.idPersona;
    }
    if (!idPersona) {
      alert('ERROR: no se encuentra el ID del usuario.');
      return;
    }

    try {
      const usuario = await this.serviciobd.obtenerUsuario(idPersona);
      if (usuario) {
        this.persona = usuario;
      } else {
        await this.alertasService.presentAlert('Error', 'Usuario no encontrado.');
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
      await this.alertasService.presentAlert('Error', 'No se pudieron cargar los datos.');
    }
  }

  // Validar las nuevas contraseñas ingresadas
  validarCambioClave(): boolean {
    if (this.claveAnterior !== this.persona.clave) {
      this.alertasService.presentAlert('Error', 'La contraseña anterior no es correcta.');
      return false;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/.test(this.nuevaClave)) {
      this.alertasService.presentAlert('Error', 'La nueva contraseña debe tener al menos 6 caracteres, incluyendo mayúsculas, minúsculas y un carácter especial.');
      return false;
    }

    if (this.nuevaClave !== this.confirmarNuevaClave) {
      this.alertasService.presentAlert('Error', 'Las nuevas contraseñas no coinciden.');
      return false;
    }

    return true;
  }

  // Guardar los cambios en la contraseña
  async guardarCambios() {
    if (!this.validarCambioClave()) {
      return;
    }

    try {
      this.persona.clave = this.nuevaClave; // Actualizar con la nueva contraseña
      await this.serviciobd.modificarPersona(this.persona);

      await this.alertasService.presentAlert('Éxito', 'Contraseña actualizada correctamente.');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      await this.alertasService.presentAlert('Error', 'No se pudieron guardar los cambios.');
    }
  }
}
