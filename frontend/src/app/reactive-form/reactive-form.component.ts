import { Component, OnInit,  } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { passwordMatchValidator, validateEmail } from '../models/custom_validators.directive';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ImageSnippet } from '../models/ImageSnippet';
import { ImageService } from '../services/image.service';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';


export enum FormType{
  LOGIN,
  REGISTER, 
  INFO,
}



@Component({
  selector: 'app-reactive-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, NgClass, NgStyle, MatIconModule],
  templateUrl: './reactive-form.component.html',
  styleUrl: './reactive-form.component.css'
})
export class ReactiveFormComponent implements OnInit{
  file: string = '';
  formType: FormType = FormType.LOGIN;
  selectedFile: ImageSnippet;
  loginForm!: FormGroup;

  registerForm!: FormGroup;

  infoForm!: FormGroup;

  constructor(private authService: AuthService, 
    private router: Router, private imageService: ImageService, private matIcon: MatIconRegistry){;
    this.selectedFile = new ImageSnippet("", new File([], ""))
  }

  ngOnInit(): void{
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        // Validators.minLength(6),
        // validateEmail()
      ]),
      password: new FormControl('', [
        Validators.required,
        // Validators.minLength(8),
      ]
      ),
    });

    this.registerForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        // validateEmail()
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
      username: new FormControl('', [
        Validators.required,
      ]),
  });
  }


  public get getFormType(): typeof FormType {
        return FormType;
  }

  onFileChange(event: any) {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      const _file = URL.createObjectURL(files[0]);
      this.file = _file;
      this.resetInput();   
    }
  
  }

  resetInput(){
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
    if(input){
      input.value = "";
    }
  }

  onLoginSubmit(){
    // this.formType = this.getFormType.REGISTER;
    // this.location.go(this.location.path());
    const val = this.loginForm.value;
    
    console.log(val)

    if (val.email && val.password) {
        this.authService.login(this.extractMainPart(val.email), val.password)
            .subscribe(
                (res) => {
                    console.log(res)
                    sessionStorage.setItem("access_token", res.access)
                    localStorage.setItem("refresh_token", res.refresh)
                    this.router.navigateByUrl('/feed');
                }
            );
    }
  }

  moveToRegister(){
    this.formType = this.getFormType.REGISTER;
  }


  onRegisterSubmit(){
    console.log(this.registerForm.value);

    this.formType = this.getFormType.INFO;
    // this.location.go(this.location.path())
  }

  onInfoSubmit(){
    console.log(this.infoForm.value);
    let email: string = this.registerForm.value.email;
    let password: string = this.registerForm.value.password;
    let password2: string = this.registerForm.value.confirmPassword;
    this.authService.register(email, password, password2, this.infoForm.value.username)
        .subscribe(
          (res) => {
            console.log(res)
            if(res){
              this.router.navigateByUrl('/feed');
            }
          }
        )
  }

  backToLogin(){
    this.formType = this.getFormType.LOGIN;
    // this.location.go(this.location.path())
  }

  backToRegister(){
    this.formType = this.getFormType.REGISTER;
    // this.location.go(this.location.path())
  }

  extractMainPart(email: string): string {
    const emailParts = email.split('@');
    return emailParts[0];
  }
}
