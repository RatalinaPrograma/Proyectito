import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { ServiciobdService } from '../services/serviciobd.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reg-causaemergencia',
  templateUrl: './reg-causaemergencia.page.html',
  styleUrls: ['./reg-causaemergencia.page.scss'],
})
export class RegCausaEmergenciaPage implements OnInit {
  motivo!: string;
  descripcionMotivo!: string;
  notas!: string;
  idPaciente!: number;
  rutPaciente: string | null = null;

  constructor(
    private alertController: AlertController,
    private navCtrl: NavController,
    private serviciobd: ServiciobdService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Obtiene el estado de la navegación actual
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.idPaciente = navigation.extras.state['idPaciente'];
      this.rutPaciente = navigation.extras.state['rutPaciente'];
    }
  }

  ngOnInit() {
    alert('ID Paciente: ' + this.idPaciente);
    alert('RUT Paciente: ' + this.rutPaciente);
    if (this.idPaciente && !this.rutPaciente) {
      this.obtenerRut();
    }
  }

  async obtenerRut() {
    try {
      this.rutPaciente = await this.serviciobd.obtenerRutPorIdPaciente(this.idPaciente);
      alert('RUT del paciente: ' + this.rutPaciente);
    } catch (error) {
      console.error('Error al obtener el RUT:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo obtener el RUT del paciente.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
  async guardarDetalles() {
    if (!this.motivo || !this.descripcionMotivo || !this.notas) {
      const alert = await this.alertController.create({
        header: 'Campos Incompletos',
        message: 'Por favor, complete todos los campos obligatorios antes de guardar los detalles.',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      try {
        // Llamar al servicio para guardar la emergencia
        await this.serviciobd.agregarEmergencia(this.motivo, this.descripcionMotivo, this.notas, this.idPaciente);
  
        const alert = await this.alertController.create({
          header: 'Detalles Guardados',
          message: 'Los detalles de la causa de emergencia han sido guardados exitosamente.',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                // Pasa el RUT como parte de la URL
                this.navCtrl.navigateForward(`/envio-info/${this.rutPaciente}`);
              },
            },
          ],
        });
        await alert.present();
      } catch (error) {
        alert('Error al intentar guardar la emergencia: ' + JSON.stringify(error));
      }
    }
  }
  
}