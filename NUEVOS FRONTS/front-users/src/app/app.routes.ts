import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'choose-game',
    loadComponent: () => import('./pages/choose-game/choose-game.page').then( m => m.ChooseGamePage)
  },
  {
    path: 'final-screen',
    loadComponent: () => import('./pages/final-screen/final-screen.page').then( m => m.FinalScreenPage)
  },
  {
    path: 'guesssecretnumber',
    loadComponent: () => import('./pages/guess-secret-number/guess-secret-number.page').then( m => m.GuessSecretNumberPage)
  },
  {
    path: 'hangman',
    loadComponent: () => import('./pages/hangman/hangman.page').then( m => m.HangmanPage)
  },
  {
    path: 'leaderboard',
    loadComponent: () => import('./pages/leaderboard/leaderboard.page').then( m => m.LeaderboardPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'main',
    loadComponent: () => import('./components/main/main.component').then( m => m.MainComponent)
  },
  {
    path: 'mathrush',
    loadComponent: () => import('./pages/math-rush/math-rush.page').then( m => m.MathRushPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'story',
    loadComponent: () => import('./pages/story/story.page').then( m => m.StoryPage)
  },
  {
    path: 'wordle',
    loadComponent: () => import('./pages/wordle/wordle.page').then( m => m.WordlePage)
  },
  {
    path: 'choose-game',
    loadComponent: () => import('./pages/choose-game/choose-game.page').then( m => m.ChooseGamePage)
  },
  {
    path: 'final-screen',
    loadComponent: () => import('./pages/final-screen/final-screen.page').then( m => m.FinalScreenPage)
  },
  {
    path: 'guess-secret-number',
    loadComponent: () => import('./pages/guess-secret-number/guess-secret-number.page').then( m => m.GuessSecretNumberPage)
  },
  {
    path: 'hangman',
    loadComponent: () => import('./pages/hangman/hangman.page').then( m => m.HangmanPage)
  },
  {
    path: 'leaderboard',
    loadComponent: () => import('./pages/leaderboard/leaderboard.page').then( m => m.LeaderboardPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'math-rush',
    loadComponent: () => import('./pages/math-rush/math-rush.page').then( m => m.MathRushPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'story',
    loadComponent: () => import('./pages/story/story.page').then( m => m.StoryPage)
  },
  {
    path: 'wordle',
    loadComponent: () => import('./pages/wordle/wordle.page').then( m => m.WordlePage)
  },
];
