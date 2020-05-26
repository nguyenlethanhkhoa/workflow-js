import { TestBed } from '@angular/core/testing';

import { CanvasArrowService } from './canvas-arrow.service';

describe('CanvasArrowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CanvasArrowService = TestBed.get(CanvasArrowService);
    expect(service).toBeTruthy();
  });
});
