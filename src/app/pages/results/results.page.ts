import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonCard,
  IonCardContent,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  saveOutline,
  refreshOutline,
  homeOutline,
  shareSocialOutline,
  trophyOutline,
  checkmarkCircleOutline,
  ribbonOutline,
  sparklesOutline
} from 'ionicons/icons';
import { HighScore } from '../../models/quiz.model';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonCard,
    IonCardContent
  ]
})
export class ResultsPage implements OnInit {
  score: number = 0;
  total: number = 0;
  playerName: string = '';
  isSaved: boolean = false;
  category: string = 'General Knowledge';

  // Confetti pieces for high score celebration
  confettiPieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    animDuration: 2.5 + Math.random() * 2,
    animDelay: Math.random() * 1.5,
    size: 6 + Math.random() * 8,
    color: ['#ffc107', '#28a745', '#17a2b8', '#e83e8c', '#6f42c1', '#fd7e14'][
      Math.floor(Math.random() * 6)
    ]
  }));

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private toastController: ToastController
  ) {
    addIcons({
      saveOutline,
      refreshOutline,
      homeOutline,
      shareSocialOutline,
      trophyOutline,
      checkmarkCircleOutline,
      ribbonOutline,
      sparklesOutline
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.score = params['score'] ? Number(params['score']) : 0;
      this.total = params['total'] ? Number(params['total']) : 0;
      if (params['category']) {
        this.category = params['category'];
      }
    });
  }

  /**
   * Returns accuracy percentage (0 - 100)
   */
  get percentage(): number {
    if (!this.total || this.total <= 0) {
      return 0;
    }
    return Math.round((this.score / this.total) * 100);
  }

  /**
   * Result message based on percentage
   */
  get resultMessage(): string {
    const pct = this.percentage;
    if (pct > 80) {
      return 'Excellent!';
    } else if (pct > 60) {
      return 'Great Job!';
    } else if (pct > 40) {
      return 'Good Try!';
    } else {
      return 'Keep Practicing!';
    }
  }

  /**
   * Result emoji based on score performance
   */
  get resultEmoji(): string {
    const pct = this.percentage;
    if (pct > 80) {
      return '🏆';
    } else if (pct > 60) {
      return '🌟';
    } else if (pct > 40) {
      return '👍';
    } else {
      return '💪';
    }
  }

  /**
   * Performance feedback sub-text
   */
  get performanceSubtext(): string {
    const pct = this.percentage;
    if (pct > 80) {
      return 'Master level knowledge! You really nailed this quiz.';
    } else if (pct > 60) {
      return 'Impressive performance! You have a solid grasp of this topic.';
    } else if (pct > 40) {
      return 'Nice effort! A little more study and you will be at the top.';
    } else {
      return 'Do not give up! Review the flashcards and give it another shot.';
    }
  }

  /**
   * SVG circle progress stroke offset calculation
   */
  get strokeDashoffset(): number {
    const circumference = 2 * Math.PI * 60; // radius = 60
    const progress = Math.min(Math.max(this.percentage / 100, 0), 1);
    return circumference * (1 - progress);
  }

  /**
   * Saves high score and navigates to high scores page
   */
  async saveScore(): Promise<void> {
    if (this.isSaved) {
      this.router.navigate(['/highscores']);
      return;
    }

    const name = this.playerName.trim() || 'Anonymous Champ';
    const highScore: HighScore = {
      name: name,
      score: this.score,
      total: this.total,
      date: new Date().toISOString(),
      category: this.category
    };

    try {
      await this.storageService.saveHighScore(highScore);
      this.isSaved = true;

      const toast = await this.toastController.create({
        message: 'Score saved to leaderboard! 🏅',
        duration: 1500,
        position: 'top',
        color: 'success'
      });
      await toast.present();

      this.router.navigate(['/highscores']);
    } catch (error) {
      console.error('Error saving score:', error);
      const toast = await this.toastController.create({
        message: 'Failed to save score. Please try again.',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      await toast.present();
    }
  }

  /**
   * Replays quiz / goes to quiz home
   */
  playAgain(): void {
    this.router.navigate(['/home']);
  }

  /**
   * Navigates to home page
   */
  goHome(): void {
    this.router.navigate(['/home']);
  }

  /**
   * Shares quiz results using Web Share API or falls back to clipboard
   */
  async shareResults(): Promise<void> {
    const shareText = `I just scored ${this.score}/${this.total} (${this.percentage}%) on the ${this.category} quiz! ${this.resultEmoji} Can you beat my score?`;

    // Try native Web Share API
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Quiz Challenge Score',
          text: shareText
        });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return;
        }
        console.warn('Share API failed, falling back to clipboard', err);
      }
    }

    // Fallback: Copy to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        const toast = await this.toastController.create({
          message: 'Score summary copied to clipboard! 📋',
          duration: 2000,
          position: 'bottom',
          color: 'medium'
        });
        await toast.present();
        return;
      } catch (clipErr) {
        console.error('Clipboard copy failed', clipErr);
      }
    }

    // Ultimate fallback toast
    const toast = await this.toastController.create({
      message: shareText,
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  }
}
