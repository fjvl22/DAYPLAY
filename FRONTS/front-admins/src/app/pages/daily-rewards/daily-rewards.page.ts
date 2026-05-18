import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { AdminService } from "src/app/core/services/admin.service";
import { DailyGameReward } from "src/app/core/interfaces/daily-game-reward";

@Component({
  selector: 'app-daily-rewards',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './daily-rewards.page.html'
})
export class DailyRewardsPage {

  rewards: DailyGameReward[] = [];

  constructor(private admin: AdminService) {this.load();}

  load() {this.admin.getDailyRewardRequests().subscribe(res => this.rewards = res);}

  approve(id: number) {this.admin.approveDailyReward(id).subscribe(() => this.load());}

  reject(id: number) {this.admin.rejectDailyReward(id).subscribe(() => this.load());}
}