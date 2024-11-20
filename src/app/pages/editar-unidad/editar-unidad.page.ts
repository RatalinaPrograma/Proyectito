import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiciobdService } from '../services/serviciobd.service';

@Component({
  selector: 'app-editar-unidad',
  templateUrl: './editar-unidad.page.html',
  styleUrls: ['./editar-unidad.page.scss'],
})
export class EditarUnidadPage implements OnInit {

  idUnidad: number | null | undefined;
  unidad: any = {
    patente: '',
    equipada: false,
    fec_mant: '',
    idestado: null
  };

  estados: any[] = []; // Lista de estados disponibles

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviciobdService: ServiciobdService
  ) { }

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.idUnidad = idParam ? +idParam : null;
    console.log("ID Unidad:", this.idUnidad); // Verifica el valor de ID
    if (this.idUnidad !== null) {
      await this.cargarUnidad();
      await this.cargarEstados();
    } else {
      console.error("ID Unidad no encontrado en la URL.");
    }
  }

  cargarUnidad() {
    this.serviciobdService.obtenerAmbulanciaPorId(this.idUnidad!).then(data => {
      this.unidad = data;
    }).catch(error => {
      console.error('Error al cargar la unidad:', error);
    });
  }

  async cargarEstados() {
    try {
      this.estados = await this.serviciobdService.listarEstados();
    } catch (error) {
      console.error('Error al cargar los estados:', error);
    }
  }

  async guardarCambios() {
    if (!this.unidad.patente || !this.unidad.fec_mant || this.unidad.idestado === null) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    try {
      await this.serviciobdService.actualizarAmbulancia(
        this.idUnidad!,
        this.unidad.patente,
        this.unidad.equipada,
        this.unidad.fec_mant,
        this.unidad.idestado
      );
      alert('Ambulancia actualizada correctamente.');
      this.router.navigate(['/mostrar-unidad', this.idUnidad]); // Redirige al detalle de la unidad
    } catch (error) {
      console.error('Error al actualizar la unidad:', error);
      alert('Ocurrió un error al guardar los cambios.');
    }
  }
}