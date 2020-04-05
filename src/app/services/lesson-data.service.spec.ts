import { TestBed } from '@angular/core/testing';

import { LessonDataService } from './lesson-data.service';

describe('LessonDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LessonDataService = TestBed.get(LessonDataService);
    expect(service).toBeTruthy();
  });
});
