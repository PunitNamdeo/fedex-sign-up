import { TestBed } from '@angular/core/testing';

import { PostUserDataService } from './post-user-data.service';
import { HttpClientModule } from '@angular/common/http';


describe('PostUserDataService', () => {
  let service: PostUserDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
    });
    service = TestBed.inject(PostUserDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
