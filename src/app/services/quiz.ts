import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from '../models/question';


@Injectable({
  providedIn: 'root'
})
export class QuizService {
  /* =========================
    CONSTANTS
  ========================= */
  private readonly STORAGE_KEY='wcq_best';
  private readonly HISTORY_KEY='wcq_history';
  private readonly QUESTIONS_PER_QUIZ=10;
  private readonly TIME_PER_QUESTION=15;
  /* =========================
    AUDIO
  ========================= */
  private correctAudio?:HTMLAudioElement;
  private wrongAudio?:HTMLAudioElement;
  private tickAudio?:HTMLAudioElement;
  /* =========================
    SIGNAL STATE
  ========================= */
  questions = signal<Question[]>([]);
  currentIndex = signal(0);
  score = signal(0);
  screen =signal<'start'|'quiz'|'result'>('start');
  timeLeft =signal(this.TIME_PER_QUESTION);
  selectedAnswer =signal<number|null>(null);
  answered = signal(false);
  level = signal<'easy'|'medium'|'hard'>('easy');
  history = signal<any[]>([]);

  /* =========================
  COMPUTED
  ========================= */


  currentQuestion = computed(()=>{
    const list=this.questions();
  return list[
    this.currentIndex()
  ] ?? null;
  });


  progress = computed(()=>{
    return ((this.currentIndex()+1)/this.QUESTIONS_PER_QUIZ)*100;
  });






  isLastQuestion = computed(()=>{
    return (
      this.currentIndex()===this.QUESTIONS_PER_QUIZ-1
    );
  });






  bestScore = computed(()=>{
    if(typeof window==='undefined')
      return null;

  const score= localStorage.getItem(this.STORAGE_KEY);
  return score?
  Number(score):
  null;
  });

  /* =========================
  CONSTRUCTOR
  ========================= */


  constructor(private http:HttpClient){
    if(typeof window!=='undefined'){
      this.correctAudio=new Audio('/sounds/correct.mp3');
      this.wrongAudio=new Audio('/sounds/wrong.mp3');
      this.tickAudio= new Audio('/sounds/tick.mp3');
      this.loadHistory();
    }
  }

  /* =========================
  LOAD QUESTIONS
  ========================= */


  loadQuestions(){
    this.http.get<Question[]>('assets/questions.json')
    .subscribe({
      next:(all)=>{
        const filtered = all.filter(q=>q.level===this.level()
  );



  const selected = filtered.sort(()=>Math.random()-0.5).slice(0,Math.min(this.QUESTIONS_PER_QUIZ,filtered.length));
  this.questions.set(selected);
  this.screen.set('quiz');
  this.startTimer();
  },


  error:(err)=>{console.error('Questions Error', err);}
  });
  }









  /* =========================
  START QUIZ
  ========================= */


  startQuiz(level:'easy'|'medium'|'hard'){
    this.level.set(level);
    this.clearTimers();
    this.questions.set([]);
    this.currentIndex.set(0);
    this.score.set(0);
    this.selectedAnswer.set(null);
    this.answered.set(false);
    this.loadQuestions();
  }
  /* =========================
  ANSWER
  ========================= */


  selectAnswer(index:number){
  const question= this.currentQuestion();
  if(!question || this.answered() )
    return;
  this.answered.set(true);
  this.selectedAnswer.set(index);
  this.stopTimer();



  if(index===question.correct){
    this.score.update(
    s=>s+1
  );
  this.playCorrect();
  }
  else{
    this.playWrong();
  }

  setTimeout(()=>{
  this.nextQuestion();
  },900);
  }









  /* =========================
  NEXT
  ========================= */


  private nextQuestion(){



    if(this.isLastQuestion()){
      this.saveBestScore();
      this.saveHistory();

    this.screen.set('result');
    return;
  }




  this.currentIndex.update(i=>i+1);
  this.selectedAnswer.set(null);
  this.answered.set(false);
  this.startTimer();
  }


  /* =========================
  TIMER
  ========================= */


  private startTimer(){



    this.stopTimer();
    this.timeLeft.set(this.TIME_PER_QUESTION);
    this.timerRef=setInterval(()=>{this.timeLeft.update(t=>t-1 );
    if(this.timeLeft()<=5 && this.timeLeft()>0){
      this.playTick();
  }



  if(this.timeLeft()<=0){



  this.stopTimer();


  this.selectAnswer(-1);


  }



  },1000);



  }





  private timerRef:any=null;









  /* =========================
  AUDIO
  ========================= */


  private playAudio(
  audio?:HTMLAudioElement
  ){


  if(!audio)
  return;



  audio.currentTime=0;


  audio.play()
  .catch(()=>{});


  }




  playCorrect(){

  this.playAudio(
  this.correctAudio
  );

  }



  playWrong(){

  this.playAudio(
  this.wrongAudio
  );

  }



  playTick(){

  this.playAudio(
  this.tickAudio
  );

  }









  /* =========================
  BEST SCORE
  ========================= */


  private saveBestScore(){



  if(typeof window==='undefined')
  return;



  const old=
  localStorage.getItem(
  this.STORAGE_KEY
  );



  if(
  old===null ||
  this.score()>Number(old)
  ){


  localStorage.setItem(
  this.STORAGE_KEY,
  String(this.score())
  );



  }



  }









  /* =========================
  HISTORY
  ========================= */


  private loadHistory(){


  const data=
  localStorage.getItem(
  this.HISTORY_KEY
  );



  if(data)

  this.history.set(
  JSON.parse(data)
  );



  }






  private saveHistory(){



  let data:any[]=[];



  const old=
  localStorage.getItem(
  this.HISTORY_KEY
  );



  if(old)

  data=JSON.parse(old);



  data.unshift({


  score:this.score(),


  level:this.level(),


  date:
  new Date()
  .toLocaleDateString()


  });




  data=data.slice(
  0,
  3
  );



  localStorage.setItem(
  this.HISTORY_KEY,
  JSON.stringify(data)
  );



  this.history.set(data);



  }








  /* =========================
  RESULT
  ========================= */


  getResultMessage(){


  const s=this.score();



  if(s>=9)

  return '🔥 أسطورة!';



  if(s>=7)

  return '⚽ ممتاز!';



  if(s>=5)

  return '👍 جيد';



  return '😅 حاول مرة أخرى';



  }







  getShareText(){



  return `

  World Cup Quiz 🏆

  Score:
  ${this.score()}/10

  Level:
  ${this.level()}

  `;



  }







  isNewRecord(){


  const best=
  localStorage.getItem(
  this.STORAGE_KEY
  );



  return best!==null &&
  Number(best)===this.score();



  }









  /* =========================
  RESTART
  ========================= */


  restart(){



  this.clearTimers();



  this.questions.set([]);


  this.currentIndex.set(0);


  this.score.set(0);


  this.selectedAnswer.set(null);


  this.answered.set(false);



  this.screen.set(
  'start'
  );


  }







  /* =========================
  TIMER CLEAN
  ========================= */


  private stopTimer(){


  if(this.timerRef){


  clearInterval(
  this.timerRef
  );


  this.timerRef=null;


  }


  }





  private clearTimers(){


    this.stopTimer();


  }





  }