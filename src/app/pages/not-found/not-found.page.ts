import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
})
export class NotFoundPage implements OnInit {
  homeRoute: string = '/home'; // Ruta por defecto

  constructor(private router: Router) {}

  ngOnInit() {
    let userRut: string = '';

    const usuario1 = localStorage.getItem('usuario');
    if (usuario1) {
      const usuario = JSON.parse(usuario1);
      userRut = usuario.rut;
    }

    this.homeRoute = `/home`;
  }

  navigateToHome() {
    this.router.navigate([this.homeRoute]);
  }
}