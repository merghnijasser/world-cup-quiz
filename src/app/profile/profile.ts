import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth';
import { XPService } from '../core/services/xp';
import { PlayerStats, ProfileService } from '../core/services/profile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  stats!: PlayerStats;
  history: any[] = [];

  constructor(
    public auth: AuthService,
    public xpService: XPService,
    public profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.stats = this.profileService.stats();
    this.loadHistory();
  }

  loadHistory() {
    const data = localStorage.getItem('wcq_history');
    if (data) {
      this.history = JSON.parse(data).slice(0, 5);
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}