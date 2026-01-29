import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersChapterComponent } from './users-chapter.component';

describe('UsersChapterComponent', () => {
  let component: UsersChapterComponent;
  let fixture: ComponentFixture<UsersChapterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersChapterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
