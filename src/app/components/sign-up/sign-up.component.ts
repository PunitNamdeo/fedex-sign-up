import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { PasswordMatchValidator } from './passwordmatch';
import { PostUserDataService } from './post-user-data.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

/*signUp component class*/
export class SignUpComponent implements OnInit{
  // @ts-ignore
  public formGroup: FormGroup;
  fedexSignUpTitle = 'FedEx Sign Up';
  requiredField = 'This field is required';
  firstNameMinLength = 'First name must be at least 5 characters long';
  lastNameMinLength = 'Last name must be at least 5 characters long';
  passwordHint = 'Choose a password of at least eight characters with combination of uppercase and lowercase letter';
  passwordUnmatched = 'Password does not match';
  post: any = '';
  passwordHide = false;
  confirmPasswordHide = false;
  passwordContainUserName = false;

  constructor(private formBuilder: FormBuilder,
              private passwordMatchValidator: PasswordMatchValidator,
              private postUserDataService: PostUserDataService) { }

  ngOnInit(): void {
    this.createForm();
  }

  /*form validators belongs to the all respected fields*/
  createForm(): void {
    const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.formGroup = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(emailRegex)]],
      firstName: [null, [Validators.required, Validators.minLength(5)]],
      lastName: [null, [Validators.required, Validators.minLength(5)]],
      password: [null, [Validators.required, this.checkPassword]],
      confirmPassword: [null, [Validators.required]],
    }, {validators: this.passwordMatchValidator.validate} /*This is a custom validator*/);
    this.passwordHide = true;
    this.confirmPasswordHide = true;
  }

  /*get firstName from formGroup*/
  get firstName(): any {
    return this.formGroup.get('firstName');
  }

  /*get lastName from formGroup*/
  get lastName(): any {
    return this.formGroup.get('lastName');
  }

  /*password validation with respect to the pattern and firstName and LastName*/
  checkPassword = (control: any): any => {
    // @ts-ignore
    const enteredPassword = control.value;
    if (control._parent && control.value) {
      enteredPassword.toLowerCase().includes(control._parent.value.firstName?.toLowerCase())
      || enteredPassword.toLowerCase().includes(control._parent.value.lastName?.toLowerCase()) ?
        this.passwordContainUserName = true : this.passwordContainUserName = false;
    }
    const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.{8,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ?
      { requirements: true } : this.passwordContainUserName ? { passwordContainUsername : true} : null;
  }

  /*return text- "string" based on the errorCode*/
  getErrorEmail(): string {
    // @ts-ignore
    return this.formGroup.get('email').hasError('required') ? 'This field is required' : this.formGroup.get('email').hasError('pattern') ? 'Not a valid email address' : '';
  }

  /*return text- "string" based on the errorCode*/
  getErrorPassword(): string {
    // @ts-ignore
    return this.formGroup.get('password').hasError('required') ? 'This field is required (at least eight characters, combination of uppercase and lowercase letter)' : this.formGroup.get('password').hasError('requirements') ? 'Password needs to be at least eight characters, combination of uppercase and lowercase letter' : this.formGroup.get('password').hasError('passwordContainUsername') ? 'Password should not contain the first and last name' : '';
  }

  /*return text- "string" based on the errorCode*/
  getErrorConfirmPassword(): string {
    // @ts-ignore
    return this.formGroup.get('confirmPassword').hasError('required') ? 'Please confirm your password' : '';
  }

  /*called on each input in either password field */
  onPasswordInput(): any {
    if (this.formGroup.hasError('noMatchingPassword')) {
      this.formGroup.controls.confirmPassword.setErrors([{noMatchingPassword: true}]);
    }
    else {
      this.formGroup.controls.confirmPassword.setErrors(null);
    }
  }

  /*submit the form after validation of data*/
  onSubmit(post: object): void {
    this.post = post;
    this.postUserDataService.postFormData(this.post);
  }
}
