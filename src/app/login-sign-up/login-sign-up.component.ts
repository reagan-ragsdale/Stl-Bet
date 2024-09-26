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
  async onSubmit() {

    if (this.isLoginMode) {
      try {
        remult.user = await UsersController.login(this.email.toLowerCase(), this.password)
      }
      catch (error: any) {
        this._snackBar.open(error.message, 'close')
      }

    }
    else {
      try {
        remult.user = await UsersController.signUp(this.email.toLowerCase(), this.password, this.confirmPassword)
      } catch (error: any) {
        this._snackBar.open(error.message, 'close')
      }
    }
    if (remult.authenticated()) {
      this.router.navigate(['/sports'])
    }








  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode
  }

  isLoginMode: boolean = true

  email = '';
  password = ''
  confirmPassword = ''

  signUpMessage = `Don't have an account? Sign Up`
  loginMessage = `Already have an account? Login`


}
