import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3000/api/admin';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService]
    });

    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch users', () => {
    const mockUsers = [{ id: 1, nickname: 'test' }];

    service.getUsers().subscribe(users => {
      expect(users.length).toBe(1);
      expect(users[0].nickname).toBe('test');
    });

    const req = httpMock.expectOne(`${apiUrl}/users`);
    expect(req.request.method).toBe('GET');

    req.flush(mockUsers);
  });

  it('should approve user', () => {
    service.approveUser(1, 'BASIC').subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/approve-user`);
    expect(req.request.method).toBe('POST');

    req.flush({ success: true });
  });
});