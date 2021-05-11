/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TimeFromToService } from './time-from-to.service';

describe('TimeFromToService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimeFromToService]
    });
  });

  it('should ...', inject([TimeFromToService], (service: TimeFromToService) => {
    expect(service).toBeTruthy();
  }));
});
