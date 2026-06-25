import { Injectable, signal } from '@angular/core';

export interface LeaderboardPlayer {
  id: string;
  username: string;
  level: number;
  xp: number;
  avatar?: string;
  bestScore?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private readonly LEADERBOARD_KEY = 'wcq_leaderboard';
  
  players = signal<LeaderboardPlayer[]>([
    { id: '1', username: 'Sara', level: 15, xp: 9300, bestScore: 10 },
    { id: '2', username: 'Karim', level: 12, xp: 7200, bestScore: 9 },
    { id: '3', username: 'Lina', level: 11, xp: 6800, bestScore: 10 },
    { id: '4', username: 'Youssef', level: 10, xp: 6500, bestScore: 8 },
    { id: '5', username: 'Nour', level: 9, xp: 6100, bestScore: 9 },
    { id: '6', username: 'Ali', level: 8, xp: 5500, bestScore: 7 },
    { id: '7', username: 'Mona', level: 7, xp: 4800, bestScore: 8 },
    { id: '8', username: 'Sami', level: 6, xp: 4200, bestScore: 6 },
    { id: '9', username: 'Leila', level: 5, xp: 3500, bestScore: 7 },
    { id: '10', username: 'Hassan', level: 4, xp: 2800, bestScore: 5 }
  ]);

  constructor() {
    this.loadPlayers();
  }

  private loadPlayers() {
    const data = localStorage.getItem(this.LEADERBOARD_KEY);
    if (data) {
      this.players.set(JSON.parse(data));
    }
  }

  private savePlayers() {
    localStorage.setItem(this.LEADERBOARD_KEY, JSON.stringify(this.players()));
  }

  getTopPlayers(limit: number = 10): LeaderboardPlayer[] {
    return this.players()
      .sort((a, b) => b.xp - a.xp)
      .slice(0, limit);
  }

  addPlayer(player: LeaderboardPlayer) {
    this.players.update(list => [...list, player]);
    this.savePlayers();
  }

  updatePlayer(id: string, updates: Partial<LeaderboardPlayer>) {
    this.players.update(list =>
      list.map(p => p.id === id ? { ...p, ...updates } : p)
    );
    this.savePlayers();
  }

  getPlayerRank(id: string): number {
    const sorted = [...this.players()].sort((a, b) => b.xp - a.xp);
    const index = sorted.findIndex(p => p.id === id);
    return index !== -1 ? index + 1 : sorted.length + 1;
  }

  getPlayersBefore(id: string): number {
    const rank = this.getPlayerRank(id);
    return rank - 1;
  }
}