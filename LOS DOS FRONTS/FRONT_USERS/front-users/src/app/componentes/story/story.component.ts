import { Component, OnInit } from '@angular/core';
import { Chapter } from '../../interfaces/chapter';
import { RequestsService } from '../../services/requests.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './story.component.html',
  styleUrl: './story.component.css'
})
export class StoryComponent implements OnInit {
  chapters: Chapter[] = [];
  currentIndex = 0;
  constructor(public requests: RequestsService, private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    if (this.authService.isPending()) {
      this.router.navigate(['/']);
      return;
    }
    this.requests.getAvailableChapters().subscribe(chapters => {
      this.chapters = chapters.sort((a, b) => a.storyId - b.storyId || a.dayNumber - b.dayNumber);
    });
  }
  getCurrentChapter(): Chapter | null {
    return this.chapters[this.currentIndex] || null;
  }
  nextChapter(): void {
    if (this.currentIndex < this.chapters.length - 1) {
      this.currentIndex++;
    }
  }
  prevChapter(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
}
