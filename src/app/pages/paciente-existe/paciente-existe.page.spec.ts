import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PacienteExistePage } from './paciente-existe.page';
import { ServiciobdService } from '../services/serviciobd.service';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';

describe('PacienteExistePage', () => {
  let component: PacienteExistePage;
  let fixture: ComponentFixture<PacienteExistePage>;
  let mockNavController: jasmine.SpyObj<NavController>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Mock para NavController con un observable
    mockNavController = jasmine.createSpyObj('NavController', ['navigateForward'], {
      ionViewWillEnter: new BehaviorSubject(null).asObservable(),
    });

    // Mock para Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [PacienteExistePage],
      providers: [
        ServiciobdService,
        SQLite,
        AlertController,
        { provide: NavController, useValue: mockNavController },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PacienteExistePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
