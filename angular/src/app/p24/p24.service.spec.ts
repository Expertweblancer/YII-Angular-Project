/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { P24Service } from './p24.service';

describe('P24Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [P24Service]
    });
  });

  it('should ...', inject([P24Service], (service: P24Service) => {
    expect(service).toBeTruthy();
  }));
});
