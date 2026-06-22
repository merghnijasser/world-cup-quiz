import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { QuizService } from '../../services/quiz';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start.html',
  styleUrl: './start.css',
})
export class StartComponent {
  constructor(public quiz: QuizService) {}

}
