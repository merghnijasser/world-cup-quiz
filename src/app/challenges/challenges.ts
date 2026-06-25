import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChallengeService } from '../core/services/challenge';
import { QuizService } from '../services/quiz';

@Component({
  selector: 'app-challenges',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './challenges.html',
  styleUrls: ['./challenges.css']
})
export class ChallengesComponent {
  constructor(
    public challengeService: ChallengeService,
    private quizService: QuizService,
    private router: Router
  ) {}

  startChallenge() {
    this.quizService.startQuiz('worldcup', 'medium', true);
    this.router.navigate(['/quiz']);
  }

  goBack() {
    this.router.navigate(['/start']);
  }
}