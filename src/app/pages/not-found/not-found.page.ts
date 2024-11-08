import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
})
export class NotFoundPage implements OnInit {

  homeRoute: string = '/home'; // Ruta por defecto

  constructor(private router: Router) { }

  ngOnInit() {
    let userRole: number = 0;
    const usuario1 = localStorage.getItem('usuario');
    if (usuario1) {
      const usuario = JSON.parse(usuario1);
      userRole = usuario.rol;
    }

    // Asigna la ruta correspondiente según el rol
    if (userRole === 1) {
      this.homeRoute = '/home';
    } else if (userRole === 2) {
      this.homeRoute = '/home';
    } else if (userRole === 3) {
      this.homeRoute = '/vista-medico';
    }
  }

  navigateToHome() {
    this.router.navigate([this.homeRoute]);
  }
}
