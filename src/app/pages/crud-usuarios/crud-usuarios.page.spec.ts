import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudUsuariosPage } from './crud-usuarios.page';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiciobdService } from '../services/serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('CrudUsuariosPage', () => {
  let component: CrudUsuariosPage;
  let fixture: ComponentFixture<CrudUsuariosPage>;
  let serviciobdServiceMock: jasmine.SpyObj<ServiciobdService>;

  beforeEach(async () => {
    // Crear mock del servicio
    serviciobdServiceMock = jasmine.createSpyObj('ServiciobdService', ['listarPersonas', 'eliminarPersona']);
    serviciobdServiceMock.listarPersonas.and.returnValue(Promise.resolve([])); // Devuelve una promesa vacía

    await TestBed.configureTestingModule({
      declarations: [CrudUsuariosPage],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: ServiciobdService, useValue: serviciobdServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudUsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
