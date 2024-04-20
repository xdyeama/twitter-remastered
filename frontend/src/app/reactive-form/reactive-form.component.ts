import { Component, Input, ModelSignal, OnInit, computed,  } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { NgIf } from '@angular/common';
import { UserModel } from '../models/UserModel';
import { passwordMatchValidator, validateEmail } from '../models/custom_validators.directive';
import { Location } from '@angular/common';


export enum FormType{
  LOGIN,
  REGISTER, 
  INFO,
}



@Component({
  selector: 'app-reactive-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, ImageUploadComponent],
  templateUrl: './reactive-form.component.html',
  styleUrl: './reactive-form.component.css'
})
export class ReactiveFormComponent implements OnInit{
  @Input() formType: FormType = FormType.LOGIN;
  // user: UserModel;
  loginForm!: FormGroup;

  registerForm!: FormGroup;

  infoForm!: FormGroup;

  constructor(private location: Location, ){;
  }

  ngOnInit(): void{
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        validateEmail()
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]
      ),
    });

    this.registerForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        validateEmail()
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]
      ),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]
      ),
    }, {validators: passwordMatchValidator});

    this.infoForm = new FormGroup({
      image: new FormControl('', [
        Validators.required,
      ]),
      name: new FormControl('', [
        Validators.required,
      ]),
      surname: new FormControl('', [
        Validators.required,
      ]),
  });
  }


  public get getFormType(): typeof FormType {
        return FormType;
  }

  onLoginSubmit(){
    console.log(this.loginForm.value);
    this.formType = this.getFormType.REGISTER;
    this.location.go(this.location.path());
  }

  onRegisterSubmit(){
    console.log(this.registerForm.value);
    this.formType = this.getFormType.INFO;
    this.location.go(this.location.path())
  }

  onInfoSubmit(){
    console.log(this.infoForm.value);
  }

  backToLogin(){
    this.formType = this.getFormType.LOGIN;
    this.location.go(this.location.path())
  }

  backToRegister(){
    this.formType = this.getFormType.REGISTER;
    this.location.go(this.location.path())
  }
}
