import { Directive, model } from '@angular/core';



@Directive()
export class UserModel{
    email = model.required<string>();
    password = model.required<string>();
    name = model.required<string>();
    surname = model.required<string>();
    image = model<string | null>();
    
    constructor(email: string = "", password: string = "", name: string = "", surname: string="", image: string = ""){}
}


export interface AuthModel{
    email: string
    password: string
}