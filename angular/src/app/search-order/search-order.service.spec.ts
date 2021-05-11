/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SearchOrderService } from './search-order.service';

describe('SearchOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchOrderService]
    });
  });

  it('should ...', inject([SearchOrderService], (service: SearchOrderService) => {
    expect(service).toBeTruthy();
  }));
});
