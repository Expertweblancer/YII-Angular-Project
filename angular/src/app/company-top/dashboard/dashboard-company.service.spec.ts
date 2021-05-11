import { TestBed, inject } from '@angular/core/testing';

import { DashboardCompanyService } from './dashboard-company.service';

describe('DashboardCompanyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardCompanyService]
    });
  });

  it('should be created', inject([DashboardCompanyService], (service: DashboardCompanyService) => {
    expect(service).toBeTruthy();
  }));
});
