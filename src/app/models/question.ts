export interface Question {
 category: string;

 question:string;

 options:string[];

 correct:number;

 level:'easy'|'medium'|'hard';

}



export interface QuizHistory {

 score:number;

 level:'easy'|'medium'|'hard';

 date:string;

}