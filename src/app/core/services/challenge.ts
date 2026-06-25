import { Injectable, signal } from '@angular/core';

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  questions: any[];
  rewardXP: number;
  rewardPoints: number;
  completed: boolean;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private readonly CHALLENGE_KEY = 'wcq_daily_challenge';
  
  dailyChallenge = signal<DailyChallenge | null>(null);
  completed = signal<boolean>(false);

  constructor() {
    this.generateOrLoadChallenge();
  }

  private generateOrLoadChallenge() {
    const today = new Date().toDateString();
    const saved = localStorage.getItem(this.CHALLENGE_KEY);
    
    if (saved) {
      const data = JSON.parse(saved);
      if (data.date === today) {
        this.dailyChallenge.set(data);
        this.completed.set(data.completed || false);
        return;
      }
    }

    // Générer nouveau challenge
    const challenge: DailyChallenge = {
      id: Date.now().toString(),
      title: '🏆 Défi du jour',
      description: 'Réponds à 5 questions spéciales sur la Coupe du Monde !',
      questions: this.generateQuestions(),
      rewardXP: 100,
      rewardPoints: 50,
      completed: false,
      date: today
    };

    this.dailyChallenge.set(challenge);
    this.completed.set(false);
    localStorage.setItem(this.CHALLENGE_KEY, JSON.stringify(challenge));
  }

  private generateQuestions(): any[] {
    return [
      {
        question: 'Qui a remporté la Coupe du Monde 2018 ?',
        options: ['France', 'Allemagne', 'Argentine', 'Brésil'],
        correct: 0
      },
      {
        question: 'Quel pays a organisé la Coupe du Monde 2022 ?',
        options: ['Qatar', 'Russie', 'Brésil', 'Afrique du Sud'],
        correct: 0
      },
      {
        question: 'Qui est le meilleur buteur de l\'histoire de la Coupe du Monde ?',
        options: ['Miroslav Klose', 'Ronaldo', 'Pelé', 'Messi'],
        correct: 0
      },
      {
        question: 'Combien de fois le Brésil a-t-il gagné la Coupe du Monde ?',
        options: ['5', '4', '3', '6'],
        correct: 0
      },
      {
        question: 'Quelle équipe a gagné la Coupe du Monde 2014 ?',
        options: ['Allemagne', 'Argentine', 'Brésil', 'Pays-Bas'],
        correct: 0
      }
    ];
  }

  completeChallenge() {
    if (this.dailyChallenge()) {
      const challenge = this.dailyChallenge();
      challenge!.completed = true;
      this.completed.set(true);
      this.dailyChallenge.set(challenge);
      localStorage.setItem(this.CHALLENGE_KEY, JSON.stringify(challenge));
    }
  }

  getTimeLeft(): string {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return '00h 00m';
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
  }

  getProgress(): number {
    const now = new Date();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    
    return Math.min(100, (elapsed / total) * 100);
  }
}