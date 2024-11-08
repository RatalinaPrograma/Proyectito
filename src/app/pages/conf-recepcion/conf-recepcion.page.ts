import { Component, OnInit } from '@angular/core';
import { ServiciobdService } from '../services/serviciobd.service';

@Component({
  selector: 'app-conf-recepcion',
  templateUrl: './conf-recepcion.page.html',
  styleUrls: ['./conf-recepcion.page.scss'],
})
export class ConfRecepcionPage implements OnInit {
  estadoRespuesta: string = 'Pendiente';
  mensajeHospital: string = 'Esperando respuesta del hospital...';
  nombreMedico: string = '';
  apellidoMedico: string = '';
  motivoEmergencia: string = '';
  observacionesEmergencia: string = '';
  fechaConfirmacion: string = '';

  constructor(private bdService: ServiciobdService) {}

  ngOnInit() {
    this.cargarEstadoRespuesta();
  }

  async cargarEstadoRespuesta() {
    try {
      const confirmacion = await this.bdService.obtenerUltimaConfirmacionConDetalles();
      
      if (confirmacion) {
        this.estadoRespuesta = confirmacion.estado_confirmacion ? 'Aceptado' : 'Rechazado';
        this.mensajeHospital = confirmacion.estado_confirmacion 
          ? 'El paciente puede ser trasladado de inmediato. Estamos preparados para recibirlo.'
          : 'Lo sentimos, no estamos preparados para recibir al paciente en este momento.';
        
        // Datos del médico y de la emergencia
        this.nombreMedico = confirmacion.nombreMedico;
        this.apellidoMedico = confirmacion.apellidoMedico;
        this.motivoEmergencia = confirmacion.motivoEmergencia;
        this.observacionesEmergencia = confirmacion.observacionesEmergencia;
        this.fechaConfirmacion = confirmacion.fecha_confirmacion;
      } else {
        this.estadoRespuesta = 'No se encontró ninguna confirmación.';
      }
    } catch (error) {
      console.error('Error al obtener el estado de la respuesta:', error);
      this.estadoRespuesta = 'Error';
      this.mensajeHospital = 'No se pudo obtener la respuesta del hospital.';
    }
  }
}
