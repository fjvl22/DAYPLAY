import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GamesPage } from './games.page';
import { AdminService } from 'src/app/services/admin.service';
import { of } from 'rxjs';

describe('GamesPage', () => {

  let component: GamesPage;
  let fixture: ComponentFixture<GamesPage>;
  let adminSpy: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {

    adminSpy = jasmine.createSpyObj('AdminService', ['getGames']);

    await TestBed.configureTestingModule({
      imports: [GamesPage],
      providers: [
        { provide: AdminService, useValue: adminSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GamesPage);
    component = fixture.componentInstance;
  });

  it('should load games', () => {

    adminSpy.getGames.and.returnValue(of([
      { id: 1, name: 'Hangman' }
    ]));

    component.ngOnInit();

    expect(adminSpy.getGames).toHaveBeenCalled();
  });
});