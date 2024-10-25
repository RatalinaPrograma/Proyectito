import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ServiciobdService } from '../services/serviciobd.service';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { SignosVitales } from '../services/signosVitales.model';

@Component({
  selector: 'app-modificar-signos-vitales',
  templateUrl: './modificar-signos-vitales.component.html',
  styleUrls: ['./modificar-signos-vitales.component.scss'],
})
export class ModificarSignosVitalesComponent  implements OnInit {

  public signosVitales: SignosVitales = {
    freq_cardiaca: 0,
    presion_arterial: '',
    temp_corporal: 0,
    sat_oxigeno: 0,
    freq_respiratoria: 0,
    condiciones: '',
    operaciones: ''
  };

  rut: string = '';
  idSignosVitales: number = 0;
  
  constructor(
    private route: ActivatedRoute, 
    private bdService: ServiciobdService,
    private alertController: AlertController,
    private location: Location
  ) { }

  ngOnInit() {
    this.rut = this.route.snapshot.paramMap.get('rutPaciente') || '';
    this.obtenerSignosVitales();
  }

  async obtenerSignosVitales() {
    try {
      const signosVitales = await this.bdService.consultartablaSignosVitalesPorRutPaciente(this.rut);
      if (signosVitales) {
        this.idSignosVitales = signosVitales.idSigno || 0;
        this.signosVitales = signosVitales;
      } else {
        await this.presentAlert('Error', 'Usuario no encontrado.');
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      await this.presentAlert('Error', 'No se pudieron cargar los datos de signos vitales del paciente.');
    }
  }

  async modificarSignosVitales(formulario: NgForm) {
    if (formulario.invalid) {
      this.presentAlert('Error', 'Todos los campos son obligatorios.');
      return;
    }
  
    // Validaciones específicas para evitar valores negativos o inválidos
    const { 
      freq_cardiaca, 
      presion_arterial, 
      temp_corporal, 
      sat_oxigeno, 
      freq_respiratoria 
    } = this.signosVitales;
  
    if (freq_cardiaca < 0) {
      this.presentAlert('Error', 'La frecuencia cardíaca no puede ser negativa.');
      return;
    }
  
    if (freq_cardiaca > 220) {
      this.presentAlert('Advertencia', 'La frecuencia cardíaca supera los niveles normales. Revise los datos ingresados.');
      return;
    }
  
    const presionArterialRegex = /^\d{2,3}\/\d{2,3}$/; // Ejemplo: 120/80
    if (!presionArterialRegex.test(presion_arterial)) {
      this.presentAlert('Error', 'La presión arterial debe tener un formato válido (ejemplo: 120/80).');
      return;
    }
  
    if (temp_corporal < 0) {
      this.presentAlert('Error', 'La temperatura corporal no puede ser negativa.');
      return;
    }
  
    if (temp_corporal < 25 || temp_corporal > 45) {
      this.presentAlert('Advertencia', 'La temperatura corporal está fuera del rango fisiológico normal. Verifique los datos.');
      return;
    }
  
    if (sat_oxigeno < 0 || sat_oxigeno > 100) {
      this.presentAlert('Error', 'La saturación de oxígeno debe estar entre 0% y 100%.');
      return;
    }
  
    if (freq_respiratoria < 0) {
      this.presentAlert('Error', 'La frecuencia respiratoria no puede ser negativa.');
      return;
    }
  
    if (freq_respiratoria > 60) {
      this.presentAlert('Advertencia', 'La frecuencia respiratoria es demasiado alta. Verifique los datos.');
      return;
    }
  
    // Si todas las validaciones son correctas, se procede a modificar los signos vitales
    try {
      const { condiciones, operaciones } = this.signosVitales;
      await this.bdService.modificarSignosVitales(
        this.idSignosVitales,
        freq_cardiaca,
        presion_arterial,
        temp_corporal,
        sat_oxigeno,
        freq_respiratoria,
        condiciones,
        operaciones
      );
      this.presentAlert('Éxito', 'Signos vitales modificados correctamente.');
      this.location.back(); // Regresar a la página anterior
    } catch (error) {
      this.presentAlert('Error', `Error al modificar los signos vitales: ${(error as any).message}`);
    }
  }
  
  
  

  async eliminarSignosVitales() {
    if (confirm('¿Está seguro de que desea eliminar los signos vitales de este paciente?')) {
      this.bdService.eliminarSignosVitales(this.idSignosVitales, this.rut);
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

}
