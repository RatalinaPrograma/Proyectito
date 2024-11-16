import {TestBed } from '@angular/core/testing';
import { ModificarHospitalPage } from './modificar-hospital.page';
import { ActivatedRoute } from '@angular/router';


  beforeEach(async() => {
await TestBed.configureTestingModule({
      declarations: [ModificarHospitalPage],
      providers: [
        { 
          provide: ActivatedRoute, 
          useValue: { snapshot: { paramMap: { get: (key: string) => 'mockValue' } } } 
        },
      ],

    }).compileComponents();
  });
