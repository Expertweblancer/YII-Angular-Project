/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppChangeService } from './app-change.service';

describe('AppChangeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppChangeService]
    });
  });

  it('should ...', inject([AppChangeService], (service: AppChangeService) => {
    expect(service).toBeTruthy();
  }));
});
