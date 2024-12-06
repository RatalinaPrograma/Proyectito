import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AlertasService {
  private alertActive = false; // Bandera para verificar si una alerta está activa

  constructor(private alertController: AlertController) {}

  async presentAlert(header: string, message: string): Promise<void> {
    if (this.alertActive) return; // Si ya hay una alerta activa, no hacer nada

    this.alertActive = true; // Activar la bandera
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.alertActive = false; // Desactivar la bandera al cerrar la alerta
          },
        },
      ],
    });
    await alert.present();
  }
}