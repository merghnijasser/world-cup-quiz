import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaderboardPlayer, LeaderboardService } from '../core/services/leaderboard';
import { XPService } from '../core/services/xp';
import { AuthService } from '../core/services/auth';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.html',
  styleUrls: ['./leaderboard.css']
})
export class LeaderboardComponent implements OnInit {
  topPlayers: LeaderboardPlayer[] = [];
  currentUserId = '';
  myRank = 0;
  playersBefore = 0;
  rankProgress = 0;

  constructor(
    private leaderboardService: LeaderboardService,
    private xpService: XPService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.topPlayers = this.leaderboardService.getTopPlayers(10);
    this.currentUserId = this.authService.getCurrentUser()?.uid || '';
    
    if (this.currentUserId) {
      this.myRank = this.leaderboardService.getPlayerRank(this.currentUserId);
      this.playersBefore = this.leaderboardService.getPlayersBefore(this.currentUserId);
      this.rankProgress = Math.max(0, 100 - (this.playersBefore / 10) * 100);
    }
  }

  getLevelIcon(level: number): string {
    return this.xpService.getLevelIcon(level);
  }

  isCurrentUser(player: LeaderboardPlayer): boolean {
    return player.id === this.currentUserId;
  }

  goBack() {
    this.router.navigate(['/start']);
  }
}