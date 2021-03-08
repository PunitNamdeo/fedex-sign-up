import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpComponent } from './sign-up.component';
import {FormBuilder, FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PostUserDataService } from './post-user-data.service';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let postUserDataService: any = null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
      ],
      declarations: [SignUpComponent],
      providers: [
        FormBuilder,
        PostUserDataService
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    // noinspection JSDeprecatedSymbols
    postUserDataService = TestBed.get(PostUserDataService);
    spyOn(postUserDataService, 'postFormData').and.callThrough();
    fixture.detectChanges();
  });

  afterEach( () => {
    postUserDataService = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when fields are empty', () => {
    expect(component.formGroup.valid).toBeFalsy();
  });

  it('firstName field validation check', () => {
    const firstName = component.firstName;
    expect(firstName.valid).toBeFalsy();

    firstName.setValue('');
    expect(firstName.hasError('required')).toBeTruthy();

    // set firstName to valid input
    firstName.setValue('Punit');
    expect(firstName.hasError('minlength')).toBeFalsy();
    expect(firstName.hasError('required')).toBeFalsy();

    // set firstName to invalid input
    firstName.setValue('Abhi');
    expect(firstName.hasError('minlength')).toBeTruthy();
    expect(firstName.hasError('required')).toBeFalsy();

  });

  it('lastName field validation check', () => {
    const lastName = component.lastName;
    expect(lastName.valid).toBeFalsy();

    lastName.setValue('');
    expect(lastName.hasError('required')).toBeTruthy();

    // set lastName to valid input
    lastName.setValue('Namdeo');
    expect(lastName.hasError('minlength')).toBeFalsy();
    expect(lastName.hasError('required')).toBeFalsy();

    // set lastName to invalid input
    lastName.setValue('Abhi');
    expect(lastName.hasError('minlength')).toBeTruthy();
    expect(lastName.hasError('required')).toBeFalsy();
  });

  it('lastName field validation check', () => {
    const lastName = component.lastName;
    expect(lastName.valid).toBeFalsy();

    lastName.setValue('');
    expect(lastName.hasError('required')).toBeTruthy();

    // set lastName to valid input
    lastName.setValue('Namdeo');
    expect(lastName.hasError('minlength')).toBeFalsy();
    expect(lastName.hasError('required')).toBeFalsy();

    // set lastName to invalid input
    lastName.setValue('Abhi');
    expect(lastName.hasError('minlength')).toBeTruthy();
    expect(lastName.hasError('required')).toBeFalsy();
  });

  it('email field validation check', () => {
    const email = component.formGroup.controls.email;
    component.getErrorEmail();
    expect(email.valid).toBeFalsy();

    email.setValue('');
    expect(email.hasError('required')).toBeTruthy();

    // set email to valid input
    email.setValue('punit.namdeo@gmail.com');
    expect(email.hasError('pattern')).toBeFalsy();
    expect(email.hasError('required')).toBeFalsy();

    // set email to invalid input
    email.setValue('Abhi@.com');
    expect(email.hasError('pattern')).toBeTruthy();
    expect(email.hasError('required')).toBeFalsy();
  });

  it('email field validation to cover the pattern issue("branch coverage")', () => {
    const email = component.formGroup.controls.email;
    email.setValue('a@.');
    component.getErrorEmail();
    expect(email.hasError('pattern')).toBeTruthy();
  });

  it('password field validation check', () => {
    component.checkPassword(component.formGroup.controls);
    const password = component.formGroup.controls.password;
    expect(password.valid).toBeFalsy();

    password.setValue('');
    expect(password.hasError('required')).toBeTruthy();

    // set password to valid input
    password.setValue('Asdfgh12k');
    expect(password.hasError('requirements')).toBeFalsy();
    expect(password.hasError('required')).toBeFalsy();

    // set password to invalid input
    password.setValue('aQsdf');
    expect(password.hasError('requirements')).toBeTruthy();
    expect(password.hasError('required')).toBeFalsy();

    expect(component.passwordContainUserName).toEqual(false);
  });

  it('password field validation check when it consists the first and last name', () => {
    component.checkPassword(component.formGroup.controls);
    const password = component.formGroup.controls.password;
    const firstName = component.formGroup.controls.firstName;
    const lastName = component.formGroup.controls.lastName;
    component.getErrorPassword();

    // set password to invalid input
    firstName.setValue('Aqsdfghjg');
    lastName.setValue('fghjg');
    password.setValue('Aqsdfghjg');
    expect(component.passwordContainUserName).toEqual(true);

    // set password to valid input
    firstName.setValue('zxcvBnmk');
    lastName.setValue('fghjg');
    password.setValue('Aqsdtyui');
    expect(component.passwordContainUserName).toEqual(false);
  });

  it('password field validation to cover the error status- requirements("mentioned for branch coverage")', () => {
    const password = component.formGroup.controls.password;
    password.setValue('Asdfg');
    component.getErrorPassword();
    expect(password.hasError('requirements')).toBeTruthy();
  });

  it('password field validation to cover the error status- passwordContainUsername("mentioned for branch coverage")', () => {
    const password = component.formGroup.controls.password;
    const firstName = component.formGroup.controls.firstName;
    firstName.setValue('Aqsdfghj');
    password.setValue('Aqsdfghjg');
    component.getErrorPassword();
    expect(password.hasError('passwordContainUsername')).toBeTruthy();
  });

  it('confirm password field validation- no match with password', () => {
    const password = component.formGroup.controls.password;
    const confirmPassword = component.formGroup.controls.confirmPassword;
    // set password to invalid input
    password.setValue('Aqsdfghjg');
    confirmPassword.setValue('Aqsdfghj');
    component.onPasswordInput();
    confirmPassword.setErrors({noMatchingPassword: true});
    expect(confirmPassword.hasError('noMatchingPassword')).toEqual(true);
  });

  it('confirm password field validation- match with password', () => {
    const password = component.formGroup.controls.password;
    const confirmPassword = component.formGroup.controls.confirmPassword;
    // set password to invalid input
    password.setValue('Aqsdfghjg');
    confirmPassword.setValue('Aqsdfghjg');
    component.onPasswordInput();
    expect(confirmPassword.hasError('noMatchingPassword')).toEqual(false);
  });

  it('submit the validated final response', () => {
    const finalResponse = {
      firstName: 'Punit',
      lastName: 'Namdeo',
      email: 'punit.namdeo@gmail.com',
      password: 'Asdfghjk',
      confirmPassword: 'Asdfghjk'
    };
    component.onSubmit(finalResponse);
    expect(postUserDataService.postFormData).toHaveBeenCalled();
  });


});
