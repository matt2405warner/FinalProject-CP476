import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  signUp(newUser: Object) {
    var value = this.userService.signUp(newUser)
    .subscribe(
      data => console.log(data),
      error => console.log(error)
    );
  }

  signIn() {
    this.router.navigateByUrl('signin');
  }
}
