import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MathrushPage } from './mathrush.page';

describe('MathrushPage', () => {
  let component: MathrushPage;
  let fixture: ComponentFixture<MathrushPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MathrushPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
