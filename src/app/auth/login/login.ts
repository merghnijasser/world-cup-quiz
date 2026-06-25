import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';




@Component({

selector:'app-login',

standalone:true,

imports:[
CommonModule,
FormsModule,
RouterModule
],

templateUrl:'./login.html',

styleUrl:'./login.css'

})


export class LoginComponent {



email='';

password='';


error='';



constructor(

private auth:AuthService,

private router:Router

){}






async login(){


try{


await this.auth.login(

this.email,

this.password

);



this.router.navigate(['/start']);



}

catch(error:any){


this.error="Email ou mot de passe incorrect";


}


}







async googleLogin(){


try{


await this.auth.loginGoogle();



this.router.navigate(['/start']);


}

catch(error:any){


this.error="Erreur Google";


}


}



}