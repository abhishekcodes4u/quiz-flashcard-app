import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonItem,
  IonRange,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { flash, playCircle, library, trophy, settingsOutline } from 'ionicons/icons';
import { QuizService } from '../../services/quiz.service';
import { QuizCategory } from '../../models/quiz.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonItem,
    IonRange,
    IonBadge
  ]
})
export class HomePage implements OnInit {
  categories: QuizCategory[] = [];
  selectedCategory: number = 0;
  selectedDifficulty: string = '';
  numberOfQuestions: number = 10;
  isLoadingCategories: boolean = false;

  constructor(
    private quizService: QuizService,
    private router: Router
  ) {
    addIcons({
      flash,
      playCircle,
      library,
      trophy,
      settingsOutline
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  /**
   * Fetches the trivia categories from QuizService
   */
  loadCategories(): void {
    this.isLoadingCategories = true;
    this.quizService.fetchCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoadingCategories = false;
      },
      error: (error) => {
        console.error('Error loading quiz categories:', error);
        this.isLoadingCategories = false;
      }
    });
  }

  /**
   * Navigates to the quiz page with user selected configuration
   */
  startQuiz(): void {
    this.router.navigate(['/quiz'], {
      queryParams: {
        amount: this.numberOfQuestions,
        category: this.selectedCategory,
        difficulty: this.selectedDifficulty
      }
    });
  }

  /**
   * Navigates to the flashcards study mode
   */
  goToFlashcards(): void {
    this.router.navigate(['/flashcards']);
  }

  /**
   * Navigates to the high scores leaderboard
   */
  goToHighScores(): void {
    this.router.navigate(['/highscores']);
  }
}
