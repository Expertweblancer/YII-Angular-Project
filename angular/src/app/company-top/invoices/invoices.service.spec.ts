/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InvoicesService } from './invoices.service';

describe('InvoicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvoicesService]
    });
  });

  it('should ...', inject([InvoicesService], (service: InvoicesService) => {
    expect(service).toBeTruthy();
  }));
});
