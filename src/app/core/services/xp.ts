import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class XPService {
  private readonly XP_KEY = 'wcq_xp';
  private readonly LEVEL_KEY = 'wcq_level';

  // State
  xp = signal<number>(0);
  level = signal<number>(1);

  // Niveaux
  private readonly LEVEL_NAMES = [
    { level: 1, name: 'Débutant', icon: '🌱' },
    { level: 2, name: 'Amateur', icon: '📖' },
    { level: 3, name: 'Confirmé', icon: '⚽' },
    { level: 4, name: 'Expert', icon: '🔥' },
    { level: 5, name: 'Maître', icon: '👑' },
    { level: 6, name: 'Légende', icon: '🏆' },
    { level: 7, name: 'Immortel', icon: '💎' },
    { level: 8, name: 'Mythique', icon: '⭐' },
    { level: 9, name: 'Ultime', icon: '🌟' },
    { level: 10, name: 'Dieu du Quiz', icon: '⚡' }
  ];

  constructor() {
    this.loadXP();
  }

  private loadXP() {
    const savedXP = localStorage.getItem(this.XP_KEY);
    const savedLevel = localStorage.getItem(this.LEVEL_KEY);
    
    if (savedXP) this.xp.set(Number(savedXP));
    if (savedLevel) this.level.set(Number(savedLevel));
  }

  private saveXP() {
    localStorage.setItem(this.XP_KEY, String(this.xp()));
    localStorage.setItem(this.LEVEL_KEY, String(this.level()));
  }

  // ✅ Méthode privée pour calculer XP max par niveau
  private getMaxXPForLevel(level: number): number {
    return level * 100; // 100 XP par niveau
  }

  // ✅ AJOUT : Méthode publique pour Profile
  maxXPForLevel(level: number): number {
    return this.getMaxXPForLevel(level);
  }

  getProgress(): number {
    const currentLevel = this.level();
    const currentXP = this.xp();
    const maxXP = this.getMaxXPForLevel(currentLevel);
    const previousLevelXP = this.getMaxXPForLevel(currentLevel - 1) || 0;
    
    const progress = ((currentXP - previousLevelXP) / (maxXP - previousLevelXP)) * 100;
    return Math.min(progress, 100);
  }

  getXPToNextLevel(): number {
    const currentLevel = this.level();
    const maxXP = this.getMaxXPForLevel(currentLevel);
    return Math.max(0, maxXP - this.xp());
  }

  getLevelName(level: number): string {
    const found = this.LEVEL_NAMES.find(l => l.level === level);
    return found ? found.name : 'Débutant';
  }

  getLevelIcon(level: number): string {
    const found = this.LEVEL_NAMES.find(l => l.level === level);
    return found ? found.icon : '🌱';
  }

  getRank(): string {
    const level = this.level();
    if (level >= 9) return '🌟 Légende Mondiale';
    if (level >= 7) return '🏆 Maître du Quiz';
    if (level >= 5) return '🔥 Expert Confirmé';
    if (level >= 3) return '⚽ Amateur Éclairé';
    return '🌱 Débutant';
  }

  addXP(amount: number): { levelUp: boolean; newLevel: number } {
    const newXP = this.xp() + amount;
    this.xp.set(newXP);
    this.saveXP();
    
    const leveledUp = this.checkLevelUp();
    return {
      levelUp: leveledUp,
      newLevel: this.level()
    };
  }

  private checkLevelUp(): boolean {
    let currentLevel = this.level();
    let leveledUp = false;

    while (this.xp() >= this.getMaxXPForLevel(currentLevel)) {
      currentLevel++;
      leveledUp = true;
    }

    if (leveledUp) {
      this.level.set(currentLevel);
      this.saveXP();
    }

    return leveledUp;
  }
}