import { Component, TemplateRef, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { auth } from '../../server/auth';
import { DbUsers } from 'src/shared/dbTasks/DbUsers';
import { HttpClient } from '@angular/common/http';
import { remult } from 'remult';
import { UsersController } from '../../shared/Controllers/UsersController';

@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.scss']
})
export class WelcomeScreenComponent {
  constructor(private router: Router, private http: HttpClient) { 
  }

  loginSignUp: string = 'Sign Up';

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

  
 
  private modalService = inject(NgbModal);

  openVerticallyCentered(content: TemplateRef<any>) {
		this.modalService.open(content, { centered: true });
	}

  async signUp(){
    if(this.emailFormControl != null && this.passwordFormControl != null && this.emailFormControl != undefined && this.passwordFormControl != undefined){
      await UsersController.signUp(this.emailFormControl.toString(), this.passwordFormControl.toString())
    }
   
  }

  

  signInUsername = '';
  signInPassword = ''
  remult = remult;

  

  ngOnInit() {
  }

}
