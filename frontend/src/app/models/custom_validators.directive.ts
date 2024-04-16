import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup, FormControl } from "@angular/forms";


export function validateEmail(): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
        const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const valid = emailRegex.test(control.value);
        return !valid ? { invalidEmail: { value: control.value }} : null;
    }
}

export function passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');

        return password && confirmPassword && password.value !== confirmPassword.value ? { 'passwordMismatch': true } : null;
    }
}

