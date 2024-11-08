import { Component } from '@angular/core';
import { ServiciobdService } from '../services/serviciobd.service';
import { Pacientes } from '../services/pacientes';
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
  rolUsuario: number = 0;
  constructor(
    private serviciobd: ServiciobdService,
    private router: Router
  ) {}

  async buscarPaciente() {
    // Verifica que el rut esté en un formato válido antes de buscar
    if (!this.validarRut(this.rut)) {
      this.mostrarError('Por favor ingrese un RUT válido (Ej: 12345678-9).');
      return;
    }
    
    this.paciente = null;
    this.mensajeError = ''; // Limpiar mensajes de error previos

    try {
      const resultado = await this.serviciobd.obtenerPaciente(this.rut.trim());
      if (resultado && resultado.nombre) {
        this.paciente = resultado; 
      } else {
        this.mostrarError('Paciente no encontrado. Por favor, regístrelo.');
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

  mostrarError(mensaje: string) {
    this.mensajeError = mensaje;
    this.paciente = null; // Asegurarse de que paciente sea null cuando hay error
  }

  irARegistrarPaciente() {
    this.router.navigate(['/nueva-emergencia']);
  }

  irAEnvioInfo() {
    this.router.navigate(['/envio-info']);
  }

  irConfirmar(){
    this.router.navigate(['/conf-recep']);
  }
}
