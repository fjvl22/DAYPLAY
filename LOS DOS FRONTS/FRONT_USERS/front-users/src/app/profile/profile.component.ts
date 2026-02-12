import { Component, OnInit } from '@angular/core';
import { Requests } from '../services/requests';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profile: any;
  constructor(private requests: Requests){}
  ngOnInit(): void {
    this.requests.getProfile().subscribe({
      next: (res) => (this.profile = res),
      error: (err) => console.error(err),
    });
  }
}
