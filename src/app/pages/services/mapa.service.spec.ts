import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MapaService } from './mapa.service';

describe('MapaService', () => {
  let service: MapaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Agregar este módulo
      providers: [MapaService],
    });
    service = TestBed.inject(MapaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
