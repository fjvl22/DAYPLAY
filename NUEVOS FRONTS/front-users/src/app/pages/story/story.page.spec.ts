import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoryPage } from './story.page';

describe('StoryPage', () => {
  let component: StoryPage;
  let fixture: ComponentFixture<StoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
