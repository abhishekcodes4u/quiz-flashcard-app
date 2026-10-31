import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonProgressBar,
  IonChip,
  IonBadge,
  IonFab,
  IonFabButton,
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonCard,
  IonCardContent,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  chevronForwardOutline,
  syncOutline,
  checkmarkCircle,
  checkmarkCircleOutline,
  add,
  closeOutline,
  trashOutline,
  sparklesOutline,
  bulbOutline,
  swapHorizontalOutline,
  bookmarkOutline,
  layersOutline
} from 'ionicons/icons';
import { Flashcard } from '../../models/quiz.model';
import { FlashcardService } from '../../services/flashcard.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-flashcards',
  templateUrl: './flashcards.page.html',
  styleUrls: ['./flashcards.page.scss'],
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
    IonProgressBar,
    IonChip,
    IonBadge,
    IonFab,
    IonFabButton,
    IonModal,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonCard,
    IonCardContent
  ]
})
export class FlashcardsPage implements OnInit, OnDestroy {
  flashcards: Flashcard[] = [];
  currentIndex: number = 0;
  selectedCategory: string = 'All';
  categories: string[] = [];
  showAddForm: boolean = false;
  newQuestion: string = '';
  newAnswer: string = '';
  newCategory: string = '';
  learnedCount: number = 0;

  // Touch handling for swipe gestures
  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private flashcardsSub?: Subscription;

  constructor(
    private flashcardService: FlashcardService,
    private storageService: StorageService,
    private toastController: ToastController
  ) {
    addIcons({
      chevronBackOutline,
      chevronForwardOutline,
      syncOutline,
      checkmarkCircle,
      checkmarkCircleOutline,
      add,
      closeOutline,
      trashOutline,
      sparklesOutline,
      bulbOutline,
      swapHorizontalOutline,
      bookmarkOutline,
      layersOutline
    });
  }

  ngOnInit(): void {
    this.subscribeToFlashcards();
  }

  ngOnDestroy(): void {
    if (this.flashcardsSub) {
      this.flashcardsSub.unsubscribe();
    }
  }

  /**
   * Subscribes to the flashcard service stream to keep UI in sync
   */
  private subscribeToFlashcards(): void {
    this.flashcardsSub = this.flashcardService.flashcards$.subscribe((cards) => {
      this.flashcards = cards || [];
      this.computeCategories();
      this.computeLearnedCount();
      
      // Ensure current index is within bounds of filtered cards
      if (this.currentIndex >= this.filteredCards.length && this.filteredCards.length > 0) {
        this.currentIndex = this.filteredCards.length - 1;
      }
    });

    // In case stream hasn't emitted loaded stored items yet, query directly
    const all = this.flashcardService.getAllFlashcards();
    if (all && all.length > 0) {
      this.flashcards = all;
      this.computeCategories();
      this.computeLearnedCount();
    }
  }

  /**
   * Computes available categories list
   */
  private computeCategories(): void {
    const set = new Set<string>();
    this.flashcards.forEach((card) => {
      if (card.category) {
        set.add(card.category);
      }
    });
    this.categories = Array.from(set);
  }

  /**
   * Computes how many total flashcards are marked as learned
   */
  private computeLearnedCount(): void {
    this.learnedCount = this.flashcards.filter((card) => card.isLearned).length;
  }

  /**
   * Returns list of flashcards filtered by selected category
   */
  get filteredCards(): Flashcard[] {
    if (!this.selectedCategory || this.selectedCategory === 'All') {
      return this.flashcards;
    }
    return this.flashcards.filter(
      (c) => c.category?.toLowerCase() === this.selectedCategory.toLowerCase()
    );
  }

  /**
   * Returns current active flashcard in the filtered view
   */
  get currentCard(): Flashcard | undefined {
    const list = this.filteredCards;
    if (list.length === 0) {
      return undefined;
    }
    if (this.currentIndex >= list.length) {
      this.currentIndex = 0;
    }
    return list[this.currentIndex];
  }

  /**
   * Gets learned progress ratio (0 to 1) for the progress bar
   */
  get learnedProgress(): number {
    if (this.flashcards.length === 0) {
      return 0;
    }
    return this.learnedCount / this.flashcards.length;
  }

  /**
   * Toggles flip state of the current card
   */
  flipCard(): void {
    const card = this.currentCard;
    if (card) {
      card.isFlipped = !card.isFlipped;
    }
  }

  /**
   * Moves to the next card (circular navigation)
   */
  nextCard(): void {
    const total = this.filteredCards.length;
    if (total <= 1) return;

    if (this.currentCard) {
      this.currentCard.isFlipped = false;
    }
    this.currentIndex = (this.currentIndex + 1) % total;
  }

  /**
   * Moves to the previous card (circular navigation)
   */
  prevCard(): void {
    const total = this.filteredCards.length;
    if (total <= 1) return;

    if (this.currentCard) {
      this.currentCard.isFlipped = false;
    }
    this.currentIndex = (this.currentIndex - 1 + total) % total;
  }

  /**
   * Marks current card as learned (or toggles) via FlashcardService
   */
  async markLearned(): Promise<void> {
    const card = this.currentCard;
    if (!card) return;

    await this.flashcardService.toggleLearned(card.id);
    this.computeLearnedCount();

    const toast = await this.toastController.create({
      message: card.isLearned ? 'Marked as Learned! 🎉' : 'Marked for review 📝',
      duration: 1200,
      position: 'bottom',
      color: card.isLearned ? 'success' : 'medium'
    });
    await toast.present();
  }

  /**
   * Filters the card deck by selected category
   */
  filterByCategory(cat: string): void {
    this.selectedCategory = cat;
    this.currentIndex = 0;
    if (this.currentCard) {
      this.currentCard.isFlipped = false;
    }
  }

  /**
   * Adds a new flashcard to the collection
   */
  async addCard(): Promise<void> {
    if (!this.newQuestion.trim() || !this.newAnswer.trim()) {
      const toast = await this.toastController.create({
        message: 'Please enter both question and answer',
        duration: 2000,
        position: 'top',
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const category =
      this.newCategory.trim() ||
      (this.selectedCategory !== 'All' ? this.selectedCategory : 'General Knowledge');

    await this.flashcardService.addFlashcard({
      question: this.newQuestion.trim(),
      answer: this.newAnswer.trim(),
      category: category
    });

    this.newQuestion = '';
    this.newAnswer = '';
    this.newCategory = '';
    this.showAddForm = false;

    // Jump to the newly added card in the current view
    const newIdx = this.filteredCards.length - 1;
    if (newIdx >= 0) {
      this.currentIndex = newIdx;
    }

    const toast = await this.toastController.create({
      message: 'Flashcard created successfully!',
      duration: 1500,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }

  /**
   * Removes current flashcard after confirmation
   */
  async deleteCard(): Promise<void> {
    const card = this.currentCard;
    if (!card) return;

    await this.flashcardService.removeFlashcard(card.id);
    this.computeLearnedCount();

    const total = this.filteredCards.length;
    if (this.currentIndex >= total && total > 0) {
      this.currentIndex = total - 1;
    }

    const toast = await this.toastController.create({
      message: 'Flashcard deleted',
      duration: 1500,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }

  /**
   * Touch gesture start
   */
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  /**
   * Touch gesture end for swipe detection
   */
  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  private handleSwipe(): void {
    const diff = this.touchEndX - this.touchStartX;
    const threshold = 50; // minimum swipe distance in px
    if (diff < -threshold) {
      // Swiped left -> next card
      this.nextCard();
    } else if (diff > threshold) {
      // Swiped right -> previous card
      this.prevCard();
    }
  }
}
