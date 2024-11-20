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
  fechaConfirmacion: string = '';
  rutMedico: string = ''; // Se actualizará con el parámetro de la URL
  idEmergencia: number = 1;

  mensajeHospital: string = 'Cargando...';
  nombreMedico: string = '';
  apellidoMedico: string = '';
  motivoEmergencia: string = '';
  observacionesEmergencia: string = '';

  cargando: boolean = false;
  accion: string = '';

  constructor(
    private bdService: ServiciobdService,
    private router: Router,
    private alertCtrl: AlertController,
    private route: ActivatedRoute // Servicio para obtener parámetros de ruta
  ) {}

  ngOnInit() {
    // Obtener el RUT desde la URL
    this.route.params.subscribe((params) => {
      this.rutMedico = params['rut']; // Asignar el RUT recibido
      if (this.rutMedico) {
        this.cargarDetalles(); // Cargar los detalles con el RUT
      } else {
        this.mostrarError('No se proporcionó un RUT válido.');
      }
    });
  }

  async cargarDetalles() {
    try {
      // Obtener datos del médico usando el RUT
      const medico = await this.bdService.obtenerMedicoPorRut(this.rutMedico);
      if (medico) {
        this.nombreMedico = medico.nombres;
        this.apellidoMedico = medico.apellidos;
      } else {
        this.nombreMedico = 'Desconocido';
        this.apellidoMedico = 'Desconocido';
        console.error('No se encontró al médico con el RUT proporcionado.');
      }

      // Obtener detalles de la emergencia
      const emergencia = await this.bdService.obtenerEmergenciaPorId(this.idEmergencia);
      this.motivoEmergencia = emergencia ? emergencia.motivo : 'Motivo no encontrado';
      this.observacionesEmergencia = emergencia ? emergencia.observaciones : 'Sin observaciones';

      // Obtener última confirmación
      const ultimaConfirmacion = await this.bdService.obtenerUltimaConfirmacionConDetalles();
      this.estadoRespuesta = ultimaConfirmacion
        ? ultimaConfirmacion.estado_confirmacion
          ? 'Aceptada'
          : 'Rechazada'
        : 'Sin confirmación';
      this.fechaConfirmacion = ultimaConfirmacion
        ? new Date(ultimaConfirmacion.fecha_confirmacion).toLocaleString()
        : 'No disponible';

      // Obtener mensaje del hospital relacionado a la emergencia
      this.mensajeHospital = await this.bdService.obtenerMensajeHospitalPorEmergencia(this.idEmergencia);
    } catch (error) {
      console.error('Error al cargar los detalles:', error);
      this.mensajeHospital = 'Error al cargar los datos del hospital';
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
      this.router.navigate(['/vista-medico']);
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
              this.router.navigate(['/vista-medico']);
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
