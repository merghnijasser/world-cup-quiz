import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz';
import { AuthService } from '../../core/services/auth';
import { XPService } from '../../core/services/xp';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start.html',
  styleUrl: './start.css',
})
export class StartComponent {
  constructor(
    public quiz: QuizService,
    public auth: AuthService,
    public xpService: XPService,
    private router: Router
  ) {}

  startQuiz(level: 'easy' | 'medium' | 'hard') {
    // startQuiz accepts up to three arguments; pass only the game and level
    this.quiz.startQuiz('worldcup', level);
    this.router.navigate(['/quiz']);
  }

  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/']);
  }
}