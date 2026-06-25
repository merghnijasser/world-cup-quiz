import { Injectable, signal } from '@angular/core';

export interface PlayerStats {
  totalGames: number;
  totalCorrect: number;
  totalXP: number;
  bestScore: number;
  winRate: number;
  totalQuestions: number;
  gamesByLevel: {
    easy: number;
    medium: number;
    hard: number;
  };
  gamesByCategory: {
    worldcup: number;
    champions: number;
    euro: number;
    ballon: number;
    records: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly STATS_KEY = 'wcq_stats';

  stats = signal<PlayerStats>({
    totalGames: 0,
    totalCorrect: 0,
    totalXP: 0,
    bestScore: 0,
    winRate: 0,
    totalQuestions: 0,
    gamesByLevel: {
      easy: 0,
      medium: 0,
      hard: 0
    },
    gamesByCategory: {
      worldcup: 0,
      champions: 0,
      euro: 0,
      ballon: 0,
      records: 0
    }
  });

  constructor() {
    this.loadStats();
  }

  private loadStats() {
    const data = localStorage.getItem(this.STATS_KEY);
    if (data) {
      this.stats.set(JSON.parse(data));
    }
  }

  private saveStats() {
    localStorage.setItem(this.STATS_KEY, JSON.stringify(this.stats()));
  }

  updateStats(score: number, level: keyof PlayerStats['gamesByLevel'], category: keyof PlayerStats['gamesByCategory'], xp: number) {
    const current = this.stats();
    const totalGames = current.totalGames + 1;
    const totalCorrect = current.totalCorrect + score;
    const totalQuestions = current.totalQuestions + 10;
    const winRate = (totalCorrect / totalQuestions) * 100;

    this.stats.set({
      ...current,
      totalGames,
      totalCorrect,
      totalQuestions,
      totalXP: current.totalXP + xp,
      bestScore: Math.max(current.bestScore, score),
      winRate: Math.round(winRate),
      gamesByLevel: {
        ...current.gamesByLevel,
        [level]: current.gamesByLevel[level] + 1
      },
      gamesByCategory: {
        ...current.gamesByCategory,
        [category]: current.gamesByCategory[category] + 1
      }
    });

    this.saveStats();
  }

  getLevelPercentage(level: keyof PlayerStats['gamesByLevel']): number {
    const total = this.stats().totalGames;
    if (total === 0) return 0;
    const count = this.stats().gamesByLevel[level];
    return (count / total) * 100;
  }

  getCategoryPercentage(category: keyof PlayerStats['gamesByCategory']): number {
    const total = this.stats().totalGames;
    if (total === 0) return 0;
    const count = this.stats().gamesByCategory[category];
    return (count / total) * 100;
  }
}