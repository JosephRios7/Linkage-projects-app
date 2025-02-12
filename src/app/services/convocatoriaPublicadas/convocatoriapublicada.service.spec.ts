import { TestBed } from '@angular/core/testing';

import { ConvocatoriapublicadaService } from './convocatoriapublicada.service';

describe('ConvocatoriapublicadaService', () => {
  let service: ConvocatoriapublicadaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvocatoriapublicadaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
