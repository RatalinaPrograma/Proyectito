import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa-vivo',
  templateUrl: './mapa-vivo.page.html',
  styleUrls: ['./mapa-vivo.page.scss'],
})
export class MapaVivoPage implements OnInit {
  map!: L.Map;

  constructor() {}

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    // Inicializar el mapa centrado en Santiago
    this.map = L.map('map').setView([-33.4489, -70.6693], 10);

    // Agregar la capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    // Asegurar que los marcadores se agreguen cuando el mapa esté listo
    this.map.whenReady(() => {
      this.addExternalMarker();
    });
  }

  addExternalMarker() {
    const apiUrl = 'https://mapa-1.onrender.com/api/mapa';

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Datos recibidos:', data); // Verificar los datos recibidos

        // Verificar que los datos sean correctos
        if (data.marcadores && Array.isArray(data.marcadores)) {
          data.marcadores.forEach((marcador: { lat: number; lng: number; hospital: any; }) => {
            console.log('Marcador:', marcador); // Verificar cada marcador

            // Agregar marcador al mapa
            L.marker([marcador.lat, marcador.lng])
              .addTo(this.map)
              .bindPopup(`<b>${marcador.hospital}</b>`)
              .openPopup(); // Abrir el popup automáticamente
          });
        } else {
          console.error('La estructura de los datos es incorrecta:', data);
        }
      })
      .catch((error) => {
        console.error('Error cargando marcadores:', error);
      });
  }
}





