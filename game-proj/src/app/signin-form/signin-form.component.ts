import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { IUserForm } from '../user-form';

import { AngularFire } from 'angularfire2';

@Component({
  selector: 'app-signin-form',
  templateUrl: './signin-form.component.html',
  styleUrls: ['./signin-form.component.css']
})
export class SigninFormComponent implements OnInit, IUserForm {

  signInForm: FormGroup;
  isError: boolean = false;
  submitted: boolean = false;

  formErrors = {
    'email': '',
    'password': '',
    'error': ''
  }

  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'pattern': 'Email must follow the generic email pattern.'
    },
    'password': {
      'required': 'Password is required.',
      'pattern': 'Password can only contain characters and numbers.',
      'minlength': 'Password must be at least 6 characters long.',
      'maxlength': 'Password must be no longer then 15 characters long.'
    }
  }

  constructor(private af: AngularFire, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.signInForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.pattern(`^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$`)
        ]
      ],
      'password': ['', [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9]+$'),
        Validators.minLength(6),
        Validators.maxLength(15)
        ]
      ]
    });

    this.signInForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  signIn() {
    if (!this.isError) {
      this.submitted = true;
      this.router.navigate(['/dashboard']);
      /*this.af.auth.login({email: this.signInForm.value.email, password: this.signInForm.value.password})
        .then(data => {
          this.router.navigate(['/dashboard']);
        })
        .catch(error => this.onError(error));
        */
    }
  }

  signUp() {
    this.router.navigateByUrl('signup');
  }

  onError(data? : any) {
    if (!this.signInForm) { return; }
    this.isError = true;
    this.formErrors['error'] = data.message;
  }

  onValueChanged(data? : any) {
    if (!this.signInForm) { return; }
    const form = this.signInForm;
    this.isError = false;
    this.submitted = false;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        this.isError = true;
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
}
