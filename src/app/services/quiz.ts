import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from '../models/question';
import { Router } from '@angular/router'; 
import { XPService } from '../core/services/xp';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  /* =========================
    CONSTANTS
  ========================= */
  private readonly STORAGE_KEY = 'wcq_best';
  private readonly HISTORY_KEY = 'wcq_history';
  private readonly XP_KEY = 'wcq_xp';
  private readonly QUESTIONS_PER_QUIZ = 10;
  private readonly TIME_PER_QUESTION = 15;

  /* =========================
    XP SYSTEM
  ========================= */
  xp = signal<number>(
    typeof window !== 'undefined' 
      ? Number(localStorage.getItem(this.XP_KEY) || '0')
      : 0
  );

  level = signal<'easy'|'medium'|'hard'>('easy');
  category = signal<string>('worldcup'); // ✅ Implémenté
  isChallenge = signal<boolean>(false); // ✅ Implémenté

  // Niveaux de joueur
  playerLevel = computed(() => {
    const xp = this.xp();
    if (xp >= 1000) return { name: '🏆 Master', emoji: '👑' };
    if (xp >= 500) return { name: '⚡ Expert', emoji: '🔥' };
    if (xp >= 200) return { name: '⭐ Fan', emoji: '🌟' };
    if (xp >= 50) return { name: '🟢 Amateur', emoji: '🌱' };
    return { name: '🟡 Beginner', emoji: '📖' };
  });

  /* =========================
    AUDIO
  ========================= */
  private correctAudio?: HTMLAudioElement;
  private wrongAudio?: HTMLAudioElement;
  private tickAudio?: HTMLAudioElement;

  /* =========================
    SIGNAL STATE
  ========================= */
  questions = signal<Question[]>([]);
  currentIndex = signal(0);
  score = signal(0);
  timeLeft = signal(this.TIME_PER_QUESTION);
  selectedAnswer = signal<number | null>(null);
  answered = signal(false);
  history = signal<any[]>([]);
  earnedXP = signal(0);

  /* =========================
    COMPUTED
  ========================= */
  currentQuestion = computed(() => {
    const list = this.questions();
    return list[this.currentIndex()] ?? null;
  });

  progress = computed(() => {
    return ((this.currentIndex() + 1) / this.QUESTIONS_PER_QUIZ) * 100;
  });

  isLastQuestion = computed(() => {
    return this.currentIndex() === this.QUESTIONS_PER_QUIZ - 1;
  });

  bestScore = computed(() => {
    if (typeof window === 'undefined') return null;
    const score = localStorage.getItem(this.STORAGE_KEY);
    return score ? Number(score) : null;
  });

  /* =========================
    CONSTRUCTOR
  ========================= */
  constructor(
    private http: HttpClient,
    private router: Router,
    private xpService: XPService
  ) {
    if (typeof window !== 'undefined') {
      this.correctAudio = new Audio('/sounds/correct.mp3');
      this.wrongAudio = new Audio('/sounds/wrong.mp3');
      this.tickAudio = new Audio('/sounds/tick.mp3');
      this.loadHistory();
      this.loadXP();
    }
  }

  /* =========================
    XP SYSTEM - MÉTHODES
  ========================= */
  private loadXP() {
    const saved = localStorage.getItem(this.XP_KEY);
    if (saved) {
      this.xp.set(Number(saved));
    }
  }

  private saveXP() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.XP_KEY, String(this.xp()));
    }
  }

  // ✅ UNE SEULE MÉTHODE calculateEarnedXP
  calculateEarnedXP(): number {
    const score = this.score();
    const levelBonus = {
      'easy': 5,
      'medium': 10,
      'hard': 15
    };
    const bonus = levelBonus[this.level()] || 5;
    // Bonus supplémentaire si défi du jour
    const challengeBonus = this.isChallenge() ? 20 : 0;
    return (score * 10) + bonus + challengeBonus;
  }

  addXP(amount: number) {
    this.xp.update(current => current + amount);
    this.earnedXP.set(amount);
    this.saveXP();
  }

  getEarnedXP(): number {
    return this.earnedXP();
  }

  getNextLevelProgress(): number {
    const xp = this.xp();
    if (xp >= 1000) return 100;
    if (xp >= 500) return ((xp - 500) / 500) * 100;
    if (xp >= 200) return ((xp - 200) / 300) * 100;
    if (xp >= 50) return ((xp - 50) / 150) * 100;
    return (xp / 50) * 100;
  }

  /* =========================
    LOAD QUESTIONS
  ========================= */
  loadQuestions() {
    this.http.get<Question[]>('assets/questions.json')
      .subscribe({
        next: (all) => {
          // Filtrer par niveau et catégorie
          let filtered = all.filter(q => q.level === this.level());
          
          // Si catégorie spécifique
          if (this.category() !== 'all') {
            filtered = filtered.filter(q => q.category === this.category());
          }
          
          const selected = filtered
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.min(this.QUESTIONS_PER_QUIZ, filtered.length));
          
          this.questions.set(selected);
          this.router.navigate(['/quiz']);
          this.startTimer();
          this.earnedXP.set(0);
        },
        error: (err) => {
          console.error('Questions Error', err);
          this.router.navigate(['/start']);
        }
      });
  }

  /* =========================
    START QUIZ - ✅ CORRIGÉ
  ========================= */
  startQuiz(
    category: string = 'worldcup',
    level: 'easy' | 'medium' | 'hard' = 'easy',
    isChallenge: boolean = false
  ) {
    this.category.set(category);
    this.level.set(level);
    this.isChallenge.set(isChallenge);
    this.clearTimers();
    this.questions.set([]);
    this.currentIndex.set(0);
    this.score.set(0);
    this.selectedAnswer.set(null);
    this.answered.set(false);
    this.earnedXP.set(0);
    this.loadQuestions();
  }

  /* =========================
    ANSWER
  ========================= */
  selectAnswer(index: number) {
    const question = this.currentQuestion();
    if (!question || this.answered()) return;
    
    this.answered.set(true);
    this.selectedAnswer.set(index);
    this.stopTimer();

    if (index === question.correct) {
      this.score.update(s => s + 1);
      this.playCorrect();
    } else {
      this.playWrong();
    }

    setTimeout(() => {
      this.nextQuestion();
    }, 900);
  }

  /* =========================
    NEXT
  ========================= */
  private nextQuestion() {
    if (this.isLastQuestion()) {
      this.saveBestScore();
      this.saveHistory();
      
      const earned = this.calculateEarnedXP();
      this.addXP(earned);
      
      // Si défi du jour, compléter le challenge
      if (this.isChallenge()) {
        // Marquer le challenge comme complété
        localStorage.setItem('wcq_challenge_completed', 'true');
      }
      
      this.router.navigate(['/result']);
      return;
    }

    this.currentIndex.update(i => i + 1);
    this.selectedAnswer.set(null);
    this.answered.set(false);
    this.startTimer();
  }

  /* =========================
    TIMER
  ========================= */
  private timerRef: any = null;

  private startTimer() {
    this.stopTimer();
    this.timeLeft.set(this.TIME_PER_QUESTION);
    this.timerRef = setInterval(() => {
      this.timeLeft.update(t => t - 1);
      if (this.timeLeft() <= 5 && this.timeLeft() > 0) {
        this.playTick();
      }
      if (this.timeLeft() <= 0) {
        this.stopTimer();
        this.selectAnswer(-1);
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerRef) {
      clearInterval(this.timerRef);
      this.timerRef = null;
    }
  }

  private clearTimers() {
    this.stopTimer();
  }

  /* =========================
    AUDIO
  ========================= */
  private playAudio(audio?: HTMLAudioElement) {
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  playCorrect() { this.playAudio(this.correctAudio); }
  playWrong() { this.playAudio(this.wrongAudio); }
  playTick() { this.playAudio(this.tickAudio); }

  /* =========================
    BEST SCORE
  ========================= */
  private saveBestScore() {
    if (typeof window === 'undefined') return;
    const old = localStorage.getItem(this.STORAGE_KEY);
    if (old === null || this.score() > Number(old)) {
      localStorage.setItem(this.STORAGE_KEY, String(this.score()));
    }
  }

  /* =========================
    HISTORY
  ========================= */
  private loadHistory() {
    const data = localStorage.getItem(this.HISTORY_KEY);
    if (data) this.history.set(JSON.parse(data));
  }

  private saveHistory() {
    let data: any[] = [];
    const old = localStorage.getItem(this.HISTORY_KEY);
    if (old) data = JSON.parse(old);
    
    data.unshift({
      score: this.score(),
      level: this.level(),
      category: this.category(),
      date: new Date().toLocaleDateString(),
      xp: this.earnedXP(),
      isChallenge: this.isChallenge()
    });

    data = data.slice(0, 5);
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(data));
    this.history.set(data);
  }

  /* =========================
    RESULT
  ========================= */
  getResultMessage() {
    const s = this.score();
    if (s >= 9) return '🔥 أسطورة!';
    if (s >= 7) return '⚽ ممتاز!';
    if (s >= 5) return '👍 جيد';
    return '😅 حاول مرة أخرى';
  }

  getShareText() {
    return `
World Cup Quiz 🏆
Score: ${this.score()}/10
Level: ${this.level()}
Category: ${this.category()}
XP Gagné: +${this.earnedXP()} ⭐
Total XP: ${this.xp()} ⭐
Niveau: ${this.playerLevel().name}
${this.isChallenge() ? '🌟 Défi du jour complété !' : ''}
    `;
  }

  isNewRecord() {
    const best = localStorage.getItem(this.STORAGE_KEY);
    return best !== null && Number(best) === this.score() && this.score() > 0;
  }

  /* =========================
    RESTART
  ========================= */
  restart() {
    this.clearTimers();
    this.questions.set([]);
    this.currentIndex.set(0);
    this.score.set(0);
    this.selectedAnswer.set(null);
    this.answered.set(false);
    this.earnedXP.set(0);
    this.isChallenge.set(false);
    this.router.navigate(['/start']);
  }
}