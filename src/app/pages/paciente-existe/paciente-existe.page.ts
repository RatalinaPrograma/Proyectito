import { Component } from '@angular/core';
import { ServiciobdService } from '../services/serviciobd.service';
import { Pacientes } from '../services/pacientes';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-paciente-existe',
  templateUrl: './paciente-existe.page.html',
  styleUrls: ['./paciente-existe.page.scss'],
})
export class PacienteExistePage {
  rut: string = ''; 
  paciente: Pacientes | null = null; 
  mensajeError: string = '';
  constructor(
    private serviciobd: ServiciobdService,
    private alertController: AlertController,
    private router: Router,
    private navCtrl: NavController,
  ) {}
  async buscarPaciente() {
    // Verifica que el rut esté en un formato válido antes de buscar
    if (!this.validarRut(this.rut)) {
      this.mostrarError('Por favor ingrese un RUT válido (Ej: 12345678-9).');
      return;
    }
    
    this.paciente = null;
    try {
      const resultado = await this.serviciobd.obtenerPaciente(this.rut.trim());
      if (resultado && resultado.nombre) {
        this.paciente = resultado; 
      } else {
        this.mostrarAlertaPacienteNoEncontrado();
      }
    } catch (error) {
      console.error('Error al buscar paciente', error);
      this.mostrarError('Ocurrió un error al buscar el paciente.');
    }
  }
  // Validación de formato de RUT (Ej: 12345678-9 o 1234567-8)
  validarRut(rut: string): boolean {
    const rutRegex = /^[0-9]{7,8}-[0-9Kk]{1}$/;
    return rutRegex.test(rut.trim());
  }
  async mostrarAlertaPacienteNoEncontrado() {
    const alert = await this.alertController.create({
      header: 'Paciente No Encontrado',
      message: 'El paciente no se encuentra en la base de datos. Será redirigido para registrarlo.',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.router.navigate(['/nueva-emergencia']);
          },
        },
      ],
    });
    await alert.present();
  }
  mostrarError(mensaje: string) {
    this.mensajeError = mensaje;
  }

  async irEnvio() {
    this.navCtrl.navigateForward(['/reg-causaemergencia',this.paciente?.rut], {
      state: {
        idPaciente: this.paciente?.idPaciente 
      }
    });
  }
}