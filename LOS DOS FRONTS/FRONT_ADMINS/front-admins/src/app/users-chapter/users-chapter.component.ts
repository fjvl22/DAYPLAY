import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-users-chapter',
  standalone: true,
  imports: [],
  templateUrl: './users-chapter.component.html',
  styleUrl: './users-chapter.component.css'
})
export class UsersChapterComponent {
  users = [
    { nickname: 'Luis', chapter: 'Chapter 1' },
    { nickname: 'Marta', chapter: 'Chapter 2' }
  ];
  chaptersForm = new FormGroup({
    users: new FormArray(this.users.map(user =>
      new FormGroup({
        nickname: new FormControl(user.nickname),
        chapter: new FormControl(user.chapter)
      })
    ))
  });
  get usersArray(){return this.chaptersForm.get('users') as FormArray;}
  activateChapter(index: number){
    const user = this.usersArray.at(index)?.value;
    console.log('Capítulo activado para: ', user);
    this.usersArray.removeAt(index);
  }
}
