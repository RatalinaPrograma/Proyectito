import { Component, OnInit } from '@angular/core';
import { ServiciobdService } from '../services/serviciobd.service';
import { Confirmacion } from '../services/confirmacion';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-conf-recepcion',
  templateUrl: './conf-recepcion.page.html',
  styleUrls: ['./conf-recepcion.page.scss'],
})
export class ConfRecepcionPage implements OnInit {
  rutMedico: string = '12345678-9'; // RUT de ejemplo
  idEmergencia: number = 1; // ID de la emergencia

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
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    const usuario = localStorage.getItem('LSusuario');
    this.rutMedico = usuario ? JSON.parse(usuario).rut : '12345678-9';
    this.cargarDetalles();
  }

  async cargarDetalles() {
    try {
      const medico = await this.bdService.obtenerMedicoPorRut(this.rutMedico);
      this.nombreMedico = medico ? medico.nombres : 'Desconocido';
      this.apellidoMedico = medico ? medico.apellidos : 'Desconocido';

      const emergencia = await this.bdService.obtenerEmergenciaPorId(this.idEmergencia);
      this.motivoEmergencia = emergencia ? emergencia.motivo : 'Motivo no encontrado';
      this.observacionesEmergencia = emergencia ? emergencia.observaciones : 'Sin observaciones';

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
      const confirmacion = new Confirmacion(this.idEmergencia, medico.idPersona, true);

      await this.bdService.guardarConfirmacion(confirmacion);
      alert('Recepción confirmada como correcta');
      this.router.navigate(['/vista-medico']);
    } catch (error) {
      console.error('Error al confirmar la recepción:', error);
      this.mostrarError('Error al confirmar la recepción: ' + JSON.stringify(error));
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
              const alertElement = await this.alertCtrl.create({
                header: 'Error',
                message: 'Error al confirmar la recepción: ' + JSON.stringify(error),
                buttons: ['OK'],
              });
              await alertElement.present();
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

