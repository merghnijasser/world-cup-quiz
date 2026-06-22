import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { QuizService } from './services/quiz';
import { ResultComponent } from './result/result/result';
import { QuizComponent } from './quiz/quiz/quiz';
import { StartComponent } from './start/start/start';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    StartComponent,
    QuizComponent,
    ResultComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(public quiz: QuizService) {}
}
