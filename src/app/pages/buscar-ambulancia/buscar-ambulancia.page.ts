import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiciobdService } from '../services/serviciobd.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-buscar-ambulancia',
  templateUrl: './buscar-ambulancia.page.html',
  styleUrls: ['./buscar-ambulancia.page.scss'],
})
export class BuscarAmbulanciaPage implements OnInit {
  patente: string = ''; // Modelo para la patente ingresada

  constructor(
    private router: Router,
    private serviciobdService: ServiciobdService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  async buscarAmbulancia() {
    if (!this.patente.trim()) {
      // Verifica que el campo de patente no esté vacío
      await this.presentAlert('Error', 'Por favor, ingrese una patente.');
      return;
    }

    try {
      const ambulancia = await this.serviciobdService.obtenerAmbulanciaPorPatente(this.patente);

      if (ambulancia) {
        // Si la ambulancia está registrada, redirige a mostrar-unidad
        this.router.navigate(['/mostrar-unidad', ambulancia.idambulancia]);
      } else {
        // Si la ambulancia no está registrada, redirige a configuración-unidad
        await this.presentAlert('No Encontrada', 'La ambulancia no está registrada. Será redirigido a la configuración.');
        this.router.navigate(['/configuracion-unidad']);
      }
    } catch (error) {
      console.error('Error al buscar la ambulancia:', error);
      await this.presentAlert('Error', 'Ocurrió un error al buscar la ambulancia. Intente nuevamente.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
