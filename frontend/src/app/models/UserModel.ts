import { Directive, model } from '@angular/core';
import { ImageSnippet } from '../image-upload/image-upload.component';


@Directive()
export class UserModel{
    email = model.required<string>();
    password = model.required<string>();
    name = model.required<string>();
    surname = model.required<string>();
    image = model<string>();
    
    constructor(email: string = "", password: string = "", name: string = "", surname: string="", image: string = ""){}
}