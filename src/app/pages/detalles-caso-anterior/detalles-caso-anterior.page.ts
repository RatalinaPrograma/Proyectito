import { Component, OnInit } from '@angular/core';
import { ServiciobdService } from '../services/serviciobd.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detalles-caso-anterior',
  templateUrl: './detalles-caso-anterior.page.html',
  styleUrls: ['./detalles-caso-anterior.page.scss'],
})
export class DetallesCasoAnteriorPage implements OnInit {
  
  // Declaración de la propiedad emergencia
  emergencia: any = {
    fecha_emer: '',
    motivo: '',
    estado: '',
    desc_motivo: '',
    observaciones: '',
    idHospital: ''
  };

  constructor(
    private bdService: ServiciobdService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.obtenerUltimaEmergencia();
  }

  async obtenerUltimaEmergencia() {
    try {
      const emergencia = await this.bdService.obtenerUltimaEmergencia();
      if (emergencia) {
        this.emergencia = emergencia;
      } else {
        this.presentAlert('Error', 'No se encontraron emergencias registradas.');
      }
    } catch (error) {
      this.presentAlert('Error', 'Error al obtener los detalles de la emergencia.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }
}
