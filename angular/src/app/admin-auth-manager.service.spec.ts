/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AdminAuthManagerService } from './admin-auth-manager.service';

describe('AdminAuthManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminAuthManagerService]
    });
  });

  it('should ...', inject([AdminAuthManagerService], (service: AdminAuthManagerService) => {
    expect(service).toBeTruthy();
  }));
});
