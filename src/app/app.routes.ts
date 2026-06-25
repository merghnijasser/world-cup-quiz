import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { StartComponent } from './start/start/start';
import { QuizComponent } from './quiz/quiz/quiz';
import { ResultComponent } from './result/result/result';
import { ProfileComponent } from './profile/profile';
import { LeaderboardComponent } from './leaderboard/leaderboard';
import { ChallengesComponent } from './challenges/challenges';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'start', component: StartComponent, canActivate: [AuthGuard] },
  { path: 'quiz', component: QuizComponent, canActivate: [AuthGuard] },
  { path: 'result', component: ResultComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard] },
  { path: 'challenges', component: ChallengesComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];