import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { ServiciobdService } from '../pages/services/serviciobd.service';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http'; // Para manejar peticiones HTTP

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [
        IonicModule.forRoot(),
        HttpClientModule, // Si usas HTTP en tus servicios
      ],
      providers: [
        ServiciobdService, // Proveer el servicio real
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
