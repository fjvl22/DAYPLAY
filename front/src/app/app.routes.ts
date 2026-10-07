import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'hangman',
    loadComponent: () => import('./pages/hangman/hangman.page').then( m => m.HangmanPage)
  },
  {
    path: 'guesssecretnumber',
    loadComponent: () => import('./pages/guesssecretnumber/guesssecretnumber.page').then( m => m.GuesssecretnumberPage)
  },
  {
    path: 'mathrush',
    loadComponent: () => import('./pages/mathrush/mathrush.page').then( m => m.MathrushPage)
  },
  {
    path: 'wordle',
    loadComponent: () => import('./pages/wordle/wordle.page').then( m => m.WordlePage)
  },
  {
    path: 'admin-register',
    loadComponent: () => import('./pages/admin-register/admin-register.page').then( m => m.AdminRegisterPage)
  },
  {
    path: 'user-register',
    loadComponent: () => import('./pages/user-register/user-register.page').then( m => m.UserRegisterPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'story',
    loadComponent: () => import('./pages/story/story.page').then( m => m.StoryPage)
  },
  {
    path: 'choose-game',
    loadComponent: () => import('./pages/choose-game/choose-game.page').then( m => m.ChooseGamePage)
  },
];
