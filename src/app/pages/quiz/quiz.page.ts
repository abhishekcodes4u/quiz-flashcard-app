import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  IonProgressBar,
  IonSpinner,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonBackButton,
  IonButtons,
  IonChip,
  IonFooter
} from '@ionic/angular/standalone';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { addIcons } from 'ionicons';
import {
  hourglassOutline,
  checkmarkCircle,
  closeCircle,
  arrowForwardOutline,
  trophyOutline,
  alertCircleOutline,
  timeOutline,
  helpCircleOutline
} from 'ionicons/icons';
import { QuizService } from '../../services/quiz.service';
import { Question } from '../../models/quiz.model';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardContent,
    IonProgressBar,
    IonSpinner,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonBadge,
    IonBackButton,
    IonButtons,
    IonChip,
    IonFooter,
    NgClass,
    CommonModule
  ]
})
export class QuizPage implements OnInit, OnDestroy {
  questions: Question[] = [];
  currentQuestionIndex: number = 0;
  score: number = 0;
  answers: string[] = [];
  selectedAnswer: string | null = null;
  isCorrect: boolean | null = null;
  isLoading: boolean = true;
  showFeedback: boolean = false;
  timeLeft: number = 30;
  timer: any = null;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public quizService: QuizService
  ) {
    addIcons({
      hourglassOutline,
      checkmarkCircle,
      closeCircle,
      arrowForwardOutline,
      trophyOutline,
      alertCircleOutline,
      timeOutline,
      helpCircleOutline
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const amount = Number(params['amount']) || 10;
      const category = Number(params['category']) || 0;
      const difficulty = (params['difficulty'] || '').toString();

      this.isLoading = true;
      this.quizService.fetchQuestions({ amount, category, difficulty }).subscribe({
        next: (questions) => {
          this.questions = questions || [];
          this.isLoading = false;
          if (this.questions.length > 0) {
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.setupCurrentQuestion();
          }
        },
        error: (error) => {
          console.error('Failed to fetch quiz questions:', error);
          this.isLoading = false;
          this.questions = [];
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.clearCountdownTimer();
  }

  /**
   * Progress through quiz: 0.0 to 1.0
   */
  get progress(): number {
    if (!this.questions || this.questions.length === 0) {
      return 0;
    }
    return (this.currentQuestionIndex + 1) / this.questions.length;
  }

  /**
   * Currently active question
   */
  get currentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  /**
   * Sets up current question state and shuffled answers
   */
  private setupCurrentQuestion(): void {
    const current = this.currentQuestion;
    if (!current) {
      return;
    }

    this.selectedAnswer = null;
    this.isCorrect = null;
    this.showFeedback = false;

    // Use pre-shuffled all_answers or shuffle on the fly
    if (current.all_answers && current.all_answers.length > 0) {
      this.answers = current.all_answers;
    } else {
      this.answers = this.quizService.shuffleAnswers(current);
      current.all_answers = this.answers;
    }

    this.startTimer();
  }

  /**
   * Starts a 30-second countdown for the question
   */
  startTimer(): void {
    this.clearCountdownTimer();
    this.timeLeft = 30;

    this.timer = setInterval(() => {
      if (this.timeLeft > 1) {
        this.timeLeft--;
      } else {
        this.timeLeft = 0;
        this.clearCountdownTimer();
        this.handleTimeout();
      }
    }, 1000);
  }

  /**
   * Handles timeout when player does not answer in 30 seconds
   */
  private handleTimeout(): void {
    if (this.showFeedback || !this.currentQuestion) {
      return;
    }
    // Auto-select empty answer (counts as wrong)
    this.selectAnswer('');
  }

  /**
   * Stops countdown timer
   */
  private clearCountdownTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Handler for user selecting an answer option
   */
  async selectAnswer(answer: string): Promise<void> {
    if (this.showFeedback || !this.currentQuestion) {
      return;
    }

    this.clearCountdownTimer();
    this.selectedAnswer = answer;
    this.isCorrect = answer === this.currentQuestion.correct_answer;

    if (this.isCorrect) {
      this.score++;
    }

    this.showFeedback = true;

    // Trigger haptic feedback with web fallback
    try {
      if (this.isCorrect) {
        await Haptics.impact({ style: ImpactStyle.Light });
      } else {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      }
    } catch {
      // Haptics web fallback
    }
  }

  /**
   * Proceeds to the next question or navigates to results
   */
  nextQuestion(): void {
    this.clearCountdownTimer();

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.setupCurrentQuestion();
    } else {
      // Last question completed, navigate to results
      this.router.navigate(['/results'], {
        queryParams: {
          score: this.score,
          total: this.questions.length,
          category: this.questions[0]?.category || 'General Knowledge'
        }
      });
    }
  }

  /**
   * Color mapping for difficulty badges
   */
  getDifficultyColor(difficulty?: string): string {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'danger';
      default:
        return 'primary';
    }
  }

  /**
   * Returns fill mode for answer buttons
   */
  getAnswerFill(answer: string): 'outline' | 'solid' {
    if (!this.showFeedback) {
      return 'outline';
    }
    if (answer === this.currentQuestion?.correct_answer || answer === this.selectedAnswer) {
      return 'solid';
    }
    return 'outline';
  }

  /**
   * Returns Ionic color attribute for answer buttons
   */
  getAnswerColor(answer: string): string {
    if (!this.showFeedback) {
      return 'primary';
    }
    if (answer === this.currentQuestion?.correct_answer) {
      return 'success';
    }
    if (answer === this.selectedAnswer && !this.isCorrect) {
      return 'danger';
    }
    return 'medium';
  }

  /**
   * Returns CSS class for answer buttons to control animations and glow
   */
  getAnswerButtonClass(answer: string): string {
    if (!this.showFeedback) {
      return '';
    }
    if (answer === this.currentQuestion?.correct_answer) {
      return 'answer-correct';
    }
    if (answer === this.selectedAnswer && !this.isCorrect) {
      return 'answer-wrong';
    }
    return 'answer-fade';
  }
}
