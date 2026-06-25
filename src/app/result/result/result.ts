import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz';
import { XPService } from '../../core/services/xp';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class ResultComponent {
  leveledUp = false;

  constructor(
    public quiz: QuizService,
    public xpService: XPService,
    private router: Router
  ) {
    // Vérifier si le joueur a monté de niveau
    const history = localStorage.getItem('wcq_history');
    if (history) {
      const data = JSON.parse(history);
      if (data.length > 0 && data[0].levelUp) {
        this.leveledUp = true;
      }
    }
  }

  get isNewRecord(): boolean {
    const best = localStorage.getItem('wcq_best');
    return best !== null && Number(best) === this.quiz.score() && this.quiz.score() > 0;
  }

  retry() {
    (this.quiz.startQuiz as any)(this.quiz.category(), this.quiz.level());
    this.router.navigate(['/quiz']);
  }

  share() {
    const text = `
World Cup Quiz 🏆
Score: ${this.quiz.score()}/10
Level: ${this.quiz.level()}
XP Gagné: +${this.quiz.getEarnedXP()} ⭐
Total XP: ${this.xpService.xp()} ⭐
Niveau: ${this.xpService.getLevelName(this.xpService.level())}
    `;

    if (navigator.share) {
      navigator.share({ text, title: 'World Cup Quiz' }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('✅ Texte copié !');
      });
    }
  }

  goHome() {
    this.quiz.restart();
    this.router.navigate(['/start']);
  }
}