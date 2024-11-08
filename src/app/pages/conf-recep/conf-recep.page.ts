import { Component, OnInit } from '@angular/core';
import { ServiciobdService } from '../services/serviciobd.service';
import { Confirmacion } from '../services/confirmacion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conf-recep',
  templateUrl: './conf-recep.page.html',
  styleUrls: ['./conf-recep.page.scss'],
})
export class ConfRecepPage implements OnInit {
  idEmergencia: number = 1;
  idMedico: number = 3;

  estadoRespuesta: string = '';
  mensajeHospital: string = '';
  nombreMedico: string = '';
  apellidoMedico: string = '';
  fechaConfirmacion: Date = new Date();

  constructor(private bdService: ServiciobdService, private router: Router) {}

  ngOnInit() {
    this.obtenerUltimaConfirmacion();
  }

  async confirmarRecepcion() {
    const confirmacion = new Confirmacion(this.idEmergencia, this.idMedico, true);
    try {
      await this.bdService.guardarConfirmacion(confirmacion);
      alert('Recepción confirmada como correcta');
      this.router.navigate(['/vista-medico']);
    } catch (error) {
      console.error('Error al confirmar la recepción:', error);
      alert('Error al confirmar la recepción: ' + JSON.stringify(error));
    }
  }

  async confirmarRecepcionIncorrecta() {
    const confirmacion = new Confirmacion(this.idEmergencia, this.idMedico, false);
    try {
      await this.bdService.guardarConfirmacion(confirmacion);
      alert('Recepción confirmada como incorrecta');
      this.router.navigate(['/vista-medico']);
    } catch (error) {
      console.error('Error al confirmar la recepción:', error);
      alert('Error al confirmar la recepción: ' + JSON.stringify(error));
    }
  }

  async obtenerUltimaConfirmacion() {
    try {
      const confirmacion = await this.bdService.obtenerUltimaConfirmacionConDetalles();
      if (confirmacion) {
        this.estadoRespuesta = confirmacion.estado_confirmacion ? 'Confirmado' : 'No Confirmado';
        this.mensajeHospital = confirmacion.motivoEmergencia || 'Sin mensaje';
        this.nombreMedico = confirmacion.nombreMedico;
        this.apellidoMedico = confirmacion.apellidoMedico;
        this.fechaConfirmacion = new Date(confirmacion.fecha_confirmacion);
      } else {
        console.warn('No se encontró ninguna confirmación.');
      }
    } catch (error) {
      console.error('Error al obtener la última confirmación:', error);
      alert('Error al cargar los detalles de confirmación.');
    }
  }

  async irPalla() {
    this.router.navigate(['/conf-recepcion']);
  }
}
