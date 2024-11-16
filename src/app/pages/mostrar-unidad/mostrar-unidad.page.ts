import { Component, OnInit } from '@angular/core';
import { ServiciobdService } from '../services/serviciobd.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mostrar-unidad',
  templateUrl: './mostrar-unidad.page.html',
  styleUrls: ['./mostrar-unidad.page.scss'],
})
export class MostrarUnidadPage implements OnInit {

  idUnidad: number | null | undefined;
  unidad: any = {};

  constructor(private route: ActivatedRoute, private serviciobdService: ServiciobdService) { }

  ngOnInit() {
    this.idUnidad = +this.route.snapshot.paramMap.get('id')!;
    this.cargarUnidad();
  }

  ionViewWillEnter() {
    // Vuelve a cargar los datos cada vez que se entra en la vista
    this.cargarUnidad();
  }

  cargarUnidad() {
    this.serviciobdService.obtenerAmbulanciaPorId(this.idUnidad!).then(data => {
      this.unidad = data;
    }).catch(error => {
      console.error('Error al cargar la unidad:', error);
    });
  }
}
