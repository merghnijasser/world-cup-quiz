import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { QuizService } from '../../services/quiz';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('questionAnimation', [
      transition('* => *', [
        style({ opacity: 0, transform: 'scale(0.85) translateY(30px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ])
    ])
  ],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class QuizComponent {
  letters = ['أ', 'ب', 'ج', 'د'];

  constructor(public quiz: QuizService) {}

  getQuestionXP(): number {
    const baseXP = 10;
    const levelBonus = { easy: 0, medium: 5, hard: 10 };
    const bonus = levelBonus[this.quiz.level()] || 0;
    return baseXP + bonus;
  }
}