import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-users-pending',
  standalone: true,
  imports: [],
  templateUrl: './users-pending.component.html',
  styleUrl: './users-pending.component.css'
})
export class UsersPendingComponent {
  users = [
    { nickname: "John", email: "john@mail.com" },
    { nickname: "Anne", email: "anne@mail.com" }
  ];
  usersForm = new FormGroup({
    users: new FormArray(this.users.map(user=>
      new FormGroup({
        nickname: new FormControl(user.nickname),
        email: new FormControl(user.email)
      })
    ))
  });
  get usersArray(){return this.usersForm.get('users') as FormArray;}
  approve(index: number){
    const user = this.usersArray.at(index)?.value;
    console.log("Approved: ", user);
    this.usersArray.removeAt(index);
  }
}
