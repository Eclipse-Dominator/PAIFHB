import { TestBed } from '@angular/core/testing';

import { CompilerApiService } from './compiler-api.service';

describe('CompilerApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompilerApiService = TestBed.get(CompilerApiService);
    expect(service).toBeTruthy();
  });
});
