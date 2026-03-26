import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { noAuthGuard } from './guards/no-auth.guard';
import { RegisterComponent } from './componentes/register/register.component';
import { MainComponent } from './componentes/main/main.component';
import { authGuard } from './guards/auth.guard';
import { leaderboardComponent } from './componentes/leaderboard/leaderboard.component';
import { FinalScrenComponent } from './componentes/final-scren/final-scren.component';
import { HangmanComponent } from './componentes/hangman/hangman.component';
import { GuessSecretNumberComponent } from './componentes/guesssecretnumber/guesssecretnumber.component';
import { MathRushComponent } from './componentes/mathrush/mathrush.component';
import { WordleComponent } from './componentes/wordle/wordle.component';
import { ChooseGameComponent } from './componentes/choose-game/choose-game.component';
import { StoryComponent } from './componentes/story/story.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [noAuthGuard] },
    {
        path: '',
        component: MainComponent,
        canActivate: [authGuard],
        children: [
            { path: 'main', component: MainComponent },
            { path: 'ranking', component: leaderboardComponent },
            { path: 'final-screen', component: FinalScrenComponent },
            { path: 'hangman', component: HangmanComponent },
            { path: 'guess-secret-number', component: GuessSecretNumberComponent },
            { path: 'math-rush', component: MathRushComponent },
            { path: 'wordle', component: WordleComponent },
            { path: 'choose-game', component: ChooseGameComponent },
            { path: 'story', component: StoryComponent },
            { path: '', redirectTo: 'main', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'login' }
];
