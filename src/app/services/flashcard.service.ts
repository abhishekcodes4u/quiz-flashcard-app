import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Flashcard } from '../models/quiz.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {
  private flashcards: Flashcard[] = [];
  private flashcardsSubject = new BehaviorSubject<Flashcard[]>([]);

  /**
   * Observable stream of the current flashcard list.
   */
  public flashcards$: Observable<Flashcard[]> = this.flashcardsSubject.asObservable();

  // Curated list of 24 default flashcards covering General Knowledge, Science, History, and Geography
  private readonly defaultFlashcards: Flashcard[] = [
    // General Knowledge
    {
      id: 1,
      category: 'General Knowledge',
      question: 'What is the longest river in the world?',
      answer: 'The Nile River (approx. 6,650 km / 4,132 miles)',
      isFlipped: false,
      isLearned: false
    },
    {
      id: 2,
      category: 'General Knowledge',
      question: 'Which language has the most native speakers worldwide?',
      answer: 'Mandarin Chinese',
      isFlipped: false,
      isLearned: false
    },
    {
      id: 3,
      category: 'General Knowledge',
      question: 'How many keys are on a standard acoustic piano?',
      answer: '88 keys (52 white and 36 black)',
      isFlipped: false,
      isLearned: false
    },
    {
      id: 4,
      category: 'General Knowledge',
      question: 'What is the currency of Japan?',
      answer: 'Japanese Yen (JPY / ¥)',
      isFlipped: false,
      isLearned: false
    },
    {
      id: 5,
      category: 'General Knowledge',
      question: 'What is the most consumed manufactured drink in the world?',
      answer: 'Tea',
      isFlipped: false,
      isLearned: false
    },
    {
      id: 6,
      category: 'General Knowledge',
      question: 'How many time zones does Russia span?',
      answer: '11 time zones',
      isFlipped: false,
      isLearned: false
    },

    // Science
    {
      id: 7,
      category: 'Science',
      question: 'What is the powerhouse of the eukaryotic cell?',
      answer: 'Mitochondria (produces ATP through cellular respiration)',
      isFlipped: false,
      isLearned: false
    },
    {
      id: 8,
      category: 'Science',
      question: 'What is the hardest natural substance on Earth?',
      answer: 'Diamond',
      isFlipped: false,
      isLearned: false
    },
    {
      id: 9,
      category: 'Science',
      question: 'What is the approximate speed of light in a vacuum?',
      answer: '299,792 kilometers per second (~186,282 miles per second)',
      isFlipped: false,
      isLearned: false
    },
    {
      id: 10,
      category: 'Science',
      question: 'Which chemical element has the atomic number 1?',
      answer: 'Hydrogen (H)',
      isFlipped: false,
      isLearned: false
    },
    {
      id: 11,
      category: 'Science',
      question: 'What gas do green plants absorb from the air during photosynthesis?',
      answer: 'Carbon Dioxide (CO2)',
      isFlipped: false,
      isLearned: false
    },
    {
      id: 12,
      category: 'Science',
      question: 'What is the primary function of red blood cells (erythrocytes)?',
      answer: 'To carry oxygen from the lungs to the body tissues and deliver CO2 back to the lungs',
      isFlipped: false,
      isLearned: false
    },

    // History
    {
      id: 13,
      category: 'History',
      question: 'In which year did the Titanic sink after hitting an iceberg?',
      answer: '1912 (April 15)',
      isFlipped: false,
      isLearned: false
    },
    {
      id: 14,
      category: 'History',
      question: 'Who was the first President of the United States?',
      answer: 'George Washington (1789–1797)',
      isFlipped: false,
      isLearned: false
    },
    {
      id: 15,
      category: 'History',
      question: 'Which ancient Wonder of the World is the only one still largely intact?',
      answer: 'The Great Pyramid of Giza',
      isFlipped: false,
      isLearned: false
    },
    {
      id: 16,
      category: 'History',
      question: 'In what year did the Berlin Wall fall, signaling the end of the Cold War?',
      answer: '1989 (November 9)',
      isFlipped: false,
      isLearned: false
    },
    {
      id: 17,
      category: 'History',
      question: 'Who is traditionally credited with authoring the ancient Greek epics the Iliad and the Odyssey?',
      answer: 'Homer',
      isFlipped: false,
      isLearned: false
    },
    {
      id: 18,
      category: 'History',
      question: 'In which year did World War II officially conclude?',
      answer: '1945',
      isFlipped: false,
      isLearned: false
    },

    // Geography
    {
      id: 19,
      category: 'Geography',
      question: 'What is the smallest independent state in the world by both area and population?',
      answer: 'Vatican City (~0.49 square kilometers)',
      isFlipped: false,
      isLearned: false
    },
    {
      id: 20,
      category: 'Geography',
      question: 'What is the largest hot desert in the world?',
      answer: 'The Sahara Desert',
      isFlipped: false,
      isLearned: false
    },
    {
      id: 21,
      category: 'Geography',
      question: 'What is the highest mountain peak above sea level on Earth?',
      answer: 'Mount Everest (8,848.86 meters / 29,031.7 feet)',
      isFlipped: false,
      isLearned: false
    },
    {
      id: 22,
      category: 'Geography',
      question: 'Which country has the highest number of natural lakes in the world?',
      answer: 'Canada (over 879,000 lakes)',
      isFlipped: false,
      isLearned: false
    },
    {
      id: 23,
      category: 'Geography',
      question: 'Which narrow waterway connects the Atlantic Ocean to the Mediterranean Sea?',
      answer: 'The Strait of Gibraltar',
      isFlipped: false,
      isLearned: false
    },
    {
      id: 24,
      category: 'Geography',
      question: 'What is the capital city of Canada?',
      answer: 'Ottawa',
      isFlipped: false,
      isLearned: false
    }
  ];

  constructor(private storageService: StorageService) {
    this.initFlashcards();
  }

  /**
   * Initializes flashcards by loading from local storage, or seeding defaults if empty.
   */
  private async initFlashcards(): Promise<void> {
    try {
      const stored = await this.storageService.getFlashcards();
      if (stored && stored.length > 0) {
        this.flashcards = stored;
      } else {
        this.flashcards = this.getDefaultFlashcards();
        await this.storageService.saveFlashcards(this.flashcards);
      }
      this.flashcardsSubject.next([...this.flashcards]);
    } catch (error) {
      console.error('Error initializing flashcards:', error);
      this.flashcards = this.getDefaultFlashcards();
      this.flashcardsSubject.next([...this.flashcards]);
    }
  }

  /**
   * Returns a copy of the default flashcard collection.
   */
  getDefaultFlashcards(): Flashcard[] {
    return JSON.parse(JSON.stringify(this.defaultFlashcards));
  }

  /**
   * Returns all current flashcards in memory.
   */
  getAllFlashcards(): Flashcard[] {
    return [...this.flashcards];
  }

  /**
   * Adds a new flashcard to the collection and persists to storage.
   */
  async addFlashcard(card: Partial<Flashcard>): Promise<Flashcard> {
    const nextId = this.flashcards.length > 0 
      ? Math.max(...this.flashcards.map((c) => c.id)) + 1 
      : 1;

    const newCard: Flashcard = {
      id: card.id ?? nextId,
      question: card.question?.trim() || 'Untitled Question',
      answer: card.answer?.trim() || 'Untitled Answer',
      category: card.category?.trim() || 'General Knowledge',
      isFlipped: false,
      isLearned: false
    };

    this.flashcards.push(newCard);
    await this.storageService.saveFlashcards(this.flashcards);
    this.flashcardsSubject.next([...this.flashcards]);
    return newCard;
  }

  /**
   * Removes a flashcard by ID and persists changes to storage.
   */
  async removeFlashcard(id: number): Promise<void> {
    this.flashcards = this.flashcards.filter((c) => c.id !== id);
    await this.storageService.saveFlashcards(this.flashcards);
    this.flashcardsSubject.next([...this.flashcards]);
  }

  /**
   * Marks a flashcard as learned.
   */
  async markAsLearned(id: number): Promise<void> {
    const card = this.flashcards.find((c) => c.id === id);
    if (card) {
      card.isLearned = true;
      await this.storageService.saveFlashcards(this.flashcards);
      this.flashcardsSubject.next([...this.flashcards]);
    }
  }

  /**
   * Toggles the learned status of a flashcard.
   */
  async toggleLearned(id: number): Promise<void> {
    const card = this.flashcards.find((c) => c.id === id);
    if (card) {
      card.isLearned = !card.isLearned;
      await this.storageService.saveFlashcards(this.flashcards);
      this.flashcardsSubject.next([...this.flashcards]);
    }
  }

  /**
   * Toggles the flipped status of a flashcard in memory.
   */
  toggleFlipped(id: number): void {
    const card = this.flashcards.find((c) => c.id === id);
    if (card) {
      card.isFlipped = !card.isFlipped;
      this.flashcardsSubject.next([...this.flashcards]);
    }
  }

  /**
   * Filters flashcards by category.
   * If category is 'All' or empty, returns all flashcards.
   */
  getByCategory(category: string): Flashcard[] {
    if (!category || category.toLowerCase() === 'all') {
      return [...this.flashcards];
    }
    return this.flashcards.filter(
      (c) => c.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Returns a list of unique category names from the current flashcard collection.
   */
  getCategories(): string[] {
    const categoriesSet = new Set(this.flashcards.map((c) => c.category));
    return Array.from(categoriesSet);
  }

  /**
   * Resets flashcards to default values and updates storage.
   */
  async resetToDefault(): Promise<void> {
    this.flashcards = this.getDefaultFlashcards();
    await this.storageService.saveFlashcards(this.flashcards);
    this.flashcardsSubject.next([...this.flashcards]);
  }
}
