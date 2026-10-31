import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonNote,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  trophyOutline,
  trashOutline,
  homeOutline,
  sparklesOutline,
  ribbonOutline,
  calendarOutline,
  playOutline,
  flameOutline
} from 'ionicons/icons';
import { HighScore } from '../../models/quiz.model';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-highscores',
  templateUrl: './highscores.page.html',
  styleUrls: ['./highscores.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonNote
  ]
})
export class HighscoresPage implements OnInit {
  highScores: HighScore[] = [];

  constructor(
    private storageService: StorageService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({
      trophyOutline,
      trashOutline,
      homeOutline,
      sparklesOutline,
      ribbonOutline,
      calendarOutline,
      playOutline,
      flameOutline
    });
  }

  ngOnInit(): void {
    this.loadHighScores();
  }

  ionViewWillEnter(): void {
    this.loadHighScores();
  }

  /**
   * Loads high scores from local storage and sorts descending by score
   */
  async loadHighScores(): Promise<void> {
    try {
      const scores = await this.storageService.getHighScores();
      // Sort descending by score, and break ties with newer dates
      this.highScores = (scores || []).sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    } catch (error) {
      console.error('Error loading high scores:', error);
      this.highScores = [];
    }
  }

  /**
   * Prompts user with confirmation dialog and clears all stored scores
   */
  async clearScores(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Clear High Scores?',
      message: 'Are you sure you want to delete all leaderboards? This cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Clear All',
          role: 'destructive',
          handler: async () => {
            try {
              await this.storageService.clearHighScores();
              this.highScores = [];
            } catch (err) {
              console.error('Failed to clear scores:', err);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Navigates back to home
   */
  goHome(): void {
    this.router.navigate(['/home']);
  }

  /**
   * Formats ISO date string to human-readable format
   */
  formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  /**
   * Returns medal emoji for top 3 and formatted rank number for others
   */
  getRankIcon(index: number): string {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `#${index + 1}`;
    }
  }

  /**
   * Calculates score percentage
   */
  getPercentage(score: HighScore): number {
    if (!score.total || score.total <= 0) return 0;
    return Math.round((score.score / score.total) * 100);
  }
}
