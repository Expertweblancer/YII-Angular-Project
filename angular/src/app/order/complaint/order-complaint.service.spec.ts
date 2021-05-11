import { TestBed, inject } from '@angular/core/testing';

import { OrderComplaintService } from './order-complaint.service';

describe('OrderComplaintService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderComplaintService]
    });
  });

  it('should be created', inject([OrderComplaintService], (service: OrderComplaintService) => {
    expect(service).toBeTruthy();
  }));
});
