import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ServiciobdService } from '../services/serviciobd.service';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { SignosVitales } from '../services/signosVitales.model';

@Component({
  selector: 'app-agregar-signos-vitales',
  templateUrl: './agregar-signos-vitales.component.html',
  styleUrls: ['./agregar-signos-vitales.component.scss'],
})
export class AgregarSignosVitalesComponent  implements OnInit {
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
  
  constructor(
    private route: ActivatedRoute, 
    private bdService: ServiciobdService,
    private alertController: AlertController,
    private location: Location
  ) { }

  ngOnInit() {
    this.rut = this.route.snapshot.paramMap.get('rut') || '';
  }

  async agregarSignosVitales(formulario: NgForm) {
    if (formulario.invalid) {
      alert('Error: '+ 'Todos los campos son obligatorios');
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

    if (freq_cardiaca < 40) {
      alert('Error '+ 'La frecuencia cardíaca no puede ser negativa.');
      return;
    }

    if (freq_cardiaca > 220) {
      alert('Advertencia: '+'La frecuencia cardíaca supera los niveles normales. Revise los datos ingresados.');
      return;
    }

    const presionArterialRegex = /^\d{2,3}\/\d{2,3}$/; // Ejemplo: 120/80
    if (!presionArterialRegex.test(presion_arterial)) {
      alert('Error: '+ 'La presión arterial debe tener un formato válido (ejemplo: 120/80).');
      return;
    }

    if (temp_corporal < 0) {
      alert('Error: '+ 'La temperatura corporal no puede ser negativa.');
      return;
    }

    if (temp_corporal < 25 || temp_corporal > 45) {
      alert('Advertencia: '+ 'La temperatura corporal está fuera del rango fisiológico normal. Verifique los datos.');
      return;
    }

    if (sat_oxigeno < 0 || sat_oxigeno > 100) {
      alert('Error: '+ 'La saturación de oxígeno debe estar entre 0% y 100%.');
      return;
    }

    if (freq_respiratoria < 0) {
      alert('Error: '+ 'La frecuencia respiratoria no puede ser negativa.');
      return;
    }

    if (freq_respiratoria > 60) {
      alert('Advertencia: '+'La frecuencia respiratoria es demasiado alta. Verifique los datos.');
      return;
    }

    // Si todas las validaciones son correctas, se procede a agregar los signos vitales
    try {
      const { condiciones, operaciones } = this.signosVitales;
      await this.bdService.agregarSignosV(
        freq_cardiaca,
        presion_arterial,
        temp_corporal,
        sat_oxigeno,
        freq_respiratoria,
        condiciones,
        operaciones,
        this.rut
      );
      alert('Éxito'+ 'Signos vitales agregados correctamente.');
      this.location.back(); // Regresar a la página anterior
    } catch (error) {
      alert('Error'+ `Error al agregar los signos vitales: ${(error as any).message}`);
    }
  }

}
