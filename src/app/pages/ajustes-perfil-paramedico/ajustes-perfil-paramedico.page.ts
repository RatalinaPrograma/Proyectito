import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiciobdService } from '../services/serviciobd.service';
import { AlertasService } from '../services/alertas.service';
import { SharedService } from '../services/shared.service';
import { Location } from '@angular/common';
import { CamaraService } from '../services/camara.service'; // Importar servicio de cámara

@Component({
  selector: 'app-ajustes-perfil-paramedico',
  templateUrl: './ajustes-perfil-paramedico.page.html',
  styleUrls: ['./ajustes-perfil-paramedico.page.scss'],
})
export class AjustesPerfilParamedicoPage implements OnInit {
  persona: any = {
    idPersona: 0,
    nombres: '',
    apellidos: '',
    rut: '',
    correo: '',
    telefono: '',
    foto: '', // La foto se guardará en formato base64
    clave: '',
    idRol: 2,
  };

  constructor(
    private route: ActivatedRoute,
    private serviciobd: ServiciobdService,
    private alertasService: AlertasService,
    private router: Router,
    private shared: SharedService,
    private location: Location,
    private camaraService: CamaraService // Inyectar el servicio de cámara
  ) {}

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  // Cargar los datos del usuario según el ID
  async cargarDatosUsuario() {
    const idPersona = this.shared.getIdUsuario();
    if (idPersona) {
      try {
        const usuario = await this.serviciobd.obtenerUsuario(idPersona);
        if (usuario) {
          this.persona = usuario; // Asignar los datos al formulario
        } else {
          await this.alertasService.presentAlert('Error', 'Usuario no encontrado.');
        }
      } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
        await this.alertasService.presentAlert('Error', 'No se pudieron cargar los datos.');
      }
    } else {
      alert('ERROR: no se encuentra id Usuario');
    }
  }

  // Guardar los cambios realizados en el perfil
  async guardarCambios() {
    try {
      await this.serviciobd.modificarPersona(this.persona); // Actualizar en BD
      await this.alertasService.presentAlert('Éxito', 'Perfil actualizado correctamente.');
      this.router.navigate(['/home']); // Redirigir a la página principal
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      await this.alertasService.presentAlert('Error', 'No se pudieron guardar los cambios.');
    }
  }

  // Tomar foto y actualizar la foto de perfil
  async tomarFoto() {
    const fotoBase64 = await this.camaraService.tomarFoto();
    if (fotoBase64) {
      this.persona.foto = fotoBase64; // Guardar la foto en la persona
    }
  }

  // Seleccionar foto desde la galería y actualizar la foto de perfil
  async seleccionarDesdeGaleria() {
    const fotoBase64 = await this.camaraService.seleccionarDesdeGaleria();
    if (fotoBase64) {
      this.persona.foto = fotoBase64; // Guardar la foto en la persona
    }
  }

  // Volver a la página anterior
  goBack() {
    this.location.back();
  }
}
