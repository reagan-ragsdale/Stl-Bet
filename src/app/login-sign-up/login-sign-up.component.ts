import { Component } from '@angular/core';
import { remult } from 'remult';
import { Router } from '@angular/router';
import { UsersController } from '../../shared/Controllers/UsersController';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-sign-up',
  templateUrl: './login-sign-up.component.html',
  styleUrls: ['./login-sign-up.component.scss']
})
export class LoginSignUpComponent {
  constructor(private router: Router, private _snackBar: MatSnackBar) {
  }
  async onSubmit(){
    
    if(this.isLoginMode){
      if(this.password.length != 0){
        try{
          remult.user = await UsersController.login(this.email.toLowerCase(), this.password)
        }
        catch(error:any){
          console.log(error)
        }
        
        if(!remult.authenticated()){
          this._snackBar.open('Wrong username and password', 'close')
        }
        
      }
      else{
        this._snackBar.open('Password required', 'close')
      }
      
      
      
    }
    else{
      if(this.password == this.confirmPassword){
        remult.user = await UsersController.signUp(this.email.toLowerCase(), this.password)
        if(!remult.authenticated()){
          this._snackBar.open('That username is already taken')
        }
      }
      else{
        this._snackBar.open('Passwords must match', 'Close');
      }
      
    }
    if(remult.authenticated()){
      this.router.navigate(['/sports'])
    }
    

    
     
    
      
    

  }

  toggleMode(){
    this.isLoginMode = !this.isLoginMode
  }

isLoginMode: boolean = true

  email = '';
  password = ''
  confirmPassword = ''

signUpMessage = `Don't have an account? Sign Up`
loginMessage = `Already have an account? Login`


}
