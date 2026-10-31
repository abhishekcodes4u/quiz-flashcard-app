import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { HighScore, Flashcard } from '../models/quiz.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly HIGH_SCORES_KEY = 'quiz_high_scores';
  private readonly FLASHCARDS_KEY = 'quiz_flashcards';
  private readonly SETTINGS_PREFIX = 'quiz_setting_';

  constructor() {}

  /**
   * Saves a new high score to local storage.
   * Maintains a sorted list of top scores (up to 20).
   */
  async saveHighScore(score: HighScore): Promise<void> {
    try {
      const scores = await this.getHighScores();
      scores.push(score);
      // Sort descending by score, then newest first
      scores.sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      // Keep top 20 records
      const topScores = scores.slice(0, 20);
      await Preferences.set({
        key: this.HIGH_SCORES_KEY,
        value: JSON.stringify(topScores)
      });
    } catch (error) {
      console.error('Error saving high score:', error);
      throw error;
    }
  }

  /**
   * Retrieves high scores list from local storage.
   */
  async getHighScores(): Promise<HighScore[]> {
    try {
      const { value } = await Preferences.get({ key: this.HIGH_SCORES_KEY });
      if (!value) {
        return [];
      }
      return JSON.parse(value) as HighScore[];
    } catch (error) {
      console.error('Error retrieving high scores:', error);
      return [];
    }
  }

  /**
   * Clears all stored high scores.
   */
  async clearHighScores(): Promise<void> {
    try {
      await Preferences.remove({ key: this.HIGH_SCORES_KEY });
    } catch (error) {
      console.error('Error clearing high scores:', error);
      throw error;
    }
  }

  /**
   * Saves all flashcards to local storage.
   */
  async saveFlashcards(cards: Flashcard[]): Promise<void> {
    try {
      await Preferences.set({
        key: this.FLASHCARDS_KEY,
        value: JSON.stringify(cards)
      });
    } catch (error) {
      console.error('Error saving flashcards:', error);
      throw error;
    }
  }

  /**
   * Retrieves flashcards list from local storage.
   */
  async getFlashcards(): Promise<Flashcard[]> {
    try {
      const { value } = await Preferences.get({ key: this.FLASHCARDS_KEY });
      if (!value) {
        return [];
      }
      return JSON.parse(value) as Flashcard[];
    } catch (error) {
      console.error('Error retrieving flashcards:', error);
      return [];
    }
  }

  /**
   * Saves an application setting to local storage.
   */
  async saveSetting(key: string, value: any): Promise<void> {
    try {
      await Preferences.set({
        key: `${this.SETTINGS_PREFIX}${key}`,
        value: JSON.stringify(value)
      });
    } catch (error) {
      console.error(`Error saving setting for key "${key}":`, error);
      throw error;
    }
  }

  /**
   * Retrieves an application setting by key from local storage.
   */
  async getSetting(key: string): Promise<any> {
    try {
      const { value } = await Preferences.get({ key: `${this.SETTINGS_PREFIX}${key}` });
      if (value === null || value === undefined) {
        return null;
      }
      return JSON.parse(value);
    } catch (error) {
      console.error(`Error retrieving setting for key "${key}":`, error);
      return null;
    }
  }
}
