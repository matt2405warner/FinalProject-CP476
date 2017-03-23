import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';



@Component({
  selector: 'app-signin-form',
  templateUrl: './signin-form.component.html',
  styleUrls: ['./signin-form.component.css']
})
export class SigninFormComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  signIn(newUser: Object) {
    var value = this.userService.signIn(newUser).subscribe(
      data => console.log(data),
      error => console.log(error)
    );
  }

  signUp() {
    this.router.navigateByUrl('signup');
  }
}
