import { Component } from '@angular/core';
import { AdminService } from '../../core/services/admin.service';
import { DailyGameReward } from '../../core/interfaces/daily-game-reward';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-daily-rewards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-rewards.component.html',
  styleUrl: './daily-rewards.component.css'
})
export class DailyRewardsComponent {
  rewards: DailyGameReward[] = [];
  constructor(private admin: AdminService) {this.load();}
  load() {
    this.admin.getDailyRewardRequests().subscribe((res: DailyGameReward[]) => {this.rewards = res;});
  }
  approve(id: number) {
    this.admin.approveDailyReward(id).subscribe(() => {this.load();});
  }
  reject(id: number) {
    this.admin.rejectDailyReward(id).subscribe(() => {this.load();});
  }
}
