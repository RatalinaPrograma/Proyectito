import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiciobdService } from '../services/serviciobd.service';
import { AlertasService } from '../services/alertas.service';
import { SharedService } from '../services/shared.service';
import { Location } from '@angular/common';
import { CamaraService } from '../services/camara.service';

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
    foto: '',
    idRol: 2,
  };

  datosOriginales: any = {}; // Datos originales para comparación

  constructor(
    private serviciobd: ServiciobdService,
    private alertasService: AlertasService,
    private router: Router,
    private shared: SharedService,
    private location: Location,
    private camaraService: CamaraService
  ) {}

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  async cargarDatosUsuario() {
    const idPersona = this.shared.getIdUsuario();
    if (idPersona) {
      try {
        const usuario = await this.serviciobd.obtenerUsuario(idPersona);
        if (usuario) {
          this.persona = { ...usuario };
          this.datosOriginales = { ...usuario }; // Guardar datos originales
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

  async guardarCambios() {
    if (!this.hayCambios()) {
      await this.alertasService.presentAlert('Aviso', 'No se detectaron cambios.');
      return;
    }

    try {
      await this.serviciobd.modificarPersona(this.persona);
      await this.alertasService.presentAlert('Éxito', 'Perfil actualizado correctamente.');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      await this.alertasService.presentAlert('Error', 'No se pudieron guardar los cambios.');
    }
  }

  hayCambios(): boolean {
    return (
      this.persona.nombres !== this.datosOriginales.nombres ||
      this.persona.apellidos !== this.datosOriginales.apellidos ||
      this.persona.rut !== this.datosOriginales.rut ||
      this.persona.telefono !== this.datosOriginales.telefono ||
      this.persona.correo !== this.datosOriginales.correo ||
      this.persona.foto !== this.datosOriginales.foto
    );
  }

  async tomarFoto() {
    const fotoBase64 = await this.camaraService.tomarFoto();
    if (fotoBase64) {
      this.persona.foto = fotoBase64;
    }
  }

  async seleccionarDesdeGaleria() {
    const fotoBase64 = await this.camaraService.seleccionarDesdeGaleria();
    if (fotoBase64) {
      this.persona.foto = fotoBase64;
    }
  }

  goBack() {
    this.location.back();
  }

  

}
