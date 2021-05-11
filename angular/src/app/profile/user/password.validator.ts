import {AbstractControl} from '@angular/forms';

export class PasswordValidator {
    static MatchPassword(AC: AbstractControl) {
       let password = AC.get('password').value; // to get value in input tag
       let confirmPassword = AC.get('password_retype').value; // to get value in input tag
        if(password != confirmPassword) {
            console.log('false');
            AC.get('password_retype').setErrors( {MatchPassword: true} )
        } else {
            console.log('true');
            return null
        }
    }
}