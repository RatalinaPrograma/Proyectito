import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vista-medico',
  templateUrl: './vista-medico.page.html',
  styleUrls: ['./vista-medico.page.scss'],
})
export class VistaMedicoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  horaActual: string | undefined;
  idRolUsuario: number | undefined;
  emergenciasActivas = [
    { titulo: 'Incendio en Edificio A', descripcion: 'Se reporta un incendio en el cuarto piso.' },
    { titulo: 'Accidente de Tráfico', descripcion: 'Colisión múltiple en la autopista.' }
  ];
}
