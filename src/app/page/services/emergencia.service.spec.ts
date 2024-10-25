import { TestBed } from '@angular/core/testing';

import { EmergenciaService } from './emergencia.service';

describe('EmergenciaService', () => {
  let service: EmergenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmergenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
