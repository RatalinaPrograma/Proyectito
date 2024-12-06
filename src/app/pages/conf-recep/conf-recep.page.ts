import { Component, OnInit } from '@angular/core';
import { ServiciobdService } from '../services/serviciobd.service';
import { Confirmacion } from '../services/confirmacion';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-conf-recep',
  templateUrl: './conf-recep.page.html',
  styleUrls: ['./conf-recep.page.scss'],
})
export class ConfRecepPage implements OnInit {
  estadoRespuesta: string = 'Pendiente';
  fechaConfirmacion: Date = new Date(); // Fecha actual
  rutMedico: string = ''; // RUT del médico, recibido desde la URL
  idEmergencia: number = 1; // Por defecto, el ID de emergencia

  nombreMedico: string = '';

  motivoEmergencia: string = '';
  observacionesEmergencia: string = '';

  cargando: boolean = false;
  accion: string = '';

  constructor(
    private bdService: ServiciobdService,
    private router: Router,
    private alertCtrl: AlertController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.fechaConfirmacion = new Date(); // Asigna la fecha actual
    this.route.params.subscribe((params) => {
      if (params['rut']) {
        this.rutMedico = params['rut'];
        console.log('RUT recibido: ' + this.rutMedico); // Depuración
        this.cargarDetalles();
      } else {
        this.mostrarError('No se proporcionó un RUT válido.');
      }
    });
  }

  async cargarDetalles() {
    try {
      // Obtener la última emergencia ingresada
      const ultimaEmergencia = await this.bdService.obtenerUltimaEmergencia();
      if (ultimaEmergencia) {
        this.idEmergencia = ultimaEmergencia.idEmerg;
        this.motivoEmergencia = ultimaEmergencia.motivo;
        this.observacionesEmergencia = ultimaEmergencia.desc_motivo;
      } else {
        this.motivoEmergencia = 'No hay emergencias registradas.';
        this.observacionesEmergencia = '';
        alert('No se encontró ninguna emergencia reciente.');
        return;
      }

      // Obtener datos del médico usando el RUT
      const medico = await this.bdService.obtenerMedicoPorRut(this.rutMedico);
      if (medico) {
        this.nombreMedico = medico.nombres + ' ' + medico.apellidos;
      } else {
        this.nombreMedico = 'Desconocido';
        console.error('No se encontró al médico con el RUT proporcionado.');
      }
    } catch (error) {
      console.error('Error al cargar los detalles:', error);
    }
  }

  async confirmarRecepcion() {
    this.cargando = true;
    this.accion = 'correcta';
    try {
      const medico = await this.bdService.obtenerMedicoPorRut(this.rutMedico);
      if (!medico) {
        throw new Error('No se encontró el médico con el RUT proporcionado.');
      }
      const confirmacion = new Confirmacion(this.idEmergencia, medico.idPersona, true);
      await this.bdService.guardarConfirmacion(confirmacion);
      alert('Recepción confirmada como correcta');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al confirmar la recepción:', error);
      this.mostrarError(`Error al confirmar la recepción: ${(error as Error).message}`);
    } finally {
      this.cargando = false;
      this.accion = '';
    }
  }

  async confirmarRecepcionIncorrecta() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que la información es incorrecta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: async () => {
            this.cargando = true;
            this.accion = 'incorrecta';
            try {
              const medico = await this.bdService.obtenerMedicoPorRut(this.rutMedico);
              if (!medico) {
                throw new Error('No se encontró el médico con el RUT proporcionado: ' + this.rutMedico);
              }
              const confirmacion = new Confirmacion(this.idEmergencia, medico.idPersona, false);
              await this.bdService.guardarConfirmacion(confirmacion);
              const alertElement = await this.alertCtrl.create({
                header: 'Confirmación',
                message: 'Recepción confirmada como incorrecta',
                buttons: ['OK'],
              });
              await alertElement.present();
              this.router.navigate(['/home']);
            } catch (error) {
              console.error('Error al confirmar la recepción:', error);
              this.mostrarError(`Error al confirmar la recepción: ${(error as Error).message}`);
            } finally {
              this.cargando = false;
              this.accion = '';
            }
          },
        },
      ],
    });
    await alert.present();
  }

  private async mostrarError(mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }
}