import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { QuizService } from '../../services/quiz';
@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class ResultComponent {


constructor(
 public quiz:QuizService
){}



get isNewRecord():boolean {


const best =
localStorage.getItem('wcq_best');


return best !== null &&
Number(best) === this.quiz.score()
&& this.quiz.score()>0;


}



retry(){

 this.quiz.startQuiz(
   this.quiz.level()
 );

}



share(){

const text =
this.quiz.getShareText();



if(navigator.share){

navigator.share({

text,

title:'World Cup Quiz'

})
.catch(()=>{});


}

else{


navigator.clipboard
.writeText(text)
.then(()=>{

alert(
'✅ تم نسخ النص'
);

});


}


}


}