import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'quiz',
    loadComponent: () => import('./pages/quiz/quiz.page').then((m) => m.QuizPage),
  },
  {
    path: 'flashcards',
    loadComponent: () => import('./pages/flashcards/flashcards.page').then((m) => m.FlashcardsPage),
  },
  {
    path: 'results',
    loadComponent: () => import('./pages/results/results.page').then((m) => m.ResultsPage),
  },
  {
    path: 'highscores',
    loadComponent: () => import('./pages/highscores/highscores.page').then((m) => m.HighscoresPage),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
