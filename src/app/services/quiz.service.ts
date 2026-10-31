import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Question, QuizCategory, QuizSettings, OpenTDBResponse, OpenTDBCategoryResponse } from '../models/quiz.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private readonly baseUrl = 'https://opentdb.com/api.php';
  private readonly categoriesUrl = 'https://opentdb.com/api_category.php';

  // Offline fallback questions in case API is unavailable or rate-limited
  private readonly fallbackQuestions: Question[] = [
    {
      category: 'General Knowledge',
      type: 'multiple',
      difficulty: 'easy',
      question: 'Which planet is known as the Red Planet?',
      correct_answer: 'Mars',
      incorrect_answers: ['Venus', 'Jupiter', 'Saturn']
    },
    {
      category: 'Science & Nature',
      type: 'multiple',
      difficulty: 'easy',
      question: 'What is the chemical symbol for water?',
      correct_answer: 'H2O',
      incorrect_answers: ['CO2', 'O2', 'NaCl']
    },
    {
      category: 'Geography',
      type: 'multiple',
      difficulty: 'medium',
      question: 'What is the capital city of Australia?',
      correct_answer: 'Canberra',
      incorrect_answers: ['Sydney', 'Melbourne', 'Brisbane']
    },
    {
      category: 'History',
      type: 'multiple',
      difficulty: 'medium',
      question: 'In which year did the Apollo 11 moon landing take place?',
      correct_answer: '1969',
      incorrect_answers: ['1965', '1971', '1975']
    },
    {
      category: 'Computers & Technology',
      type: 'multiple',
      difficulty: 'easy',
      question: 'What does "HTML" stand for?',
      correct_answer: 'HyperText Markup Language',
      incorrect_answers: [
        'HighText Machine Language',
        'HyperText Multi Language',
        'HyperTool Markup Language'
      ]
    }
  ];

  constructor(private http: HttpClient) {}

  /**
   * Fetches the list of trivia categories from Open Trivia Database API.
   */
  fetchCategories(): Observable<QuizCategory[]> {
    return this.http.get<OpenTDBCategoryResponse>(this.categoriesUrl).pipe(
      map((response) => response?.trivia_categories || []),
      catchError((error) => {
        console.warn('Failed to fetch categories from OpenTDB API, using fallback categories.', error);
        return of([
          { id: 9, name: 'General Knowledge' },
          { id: 17, name: 'Science & Nature' },
          { id: 18, name: 'Science: Computers' },
          { id: 22, name: 'Geography' },
          { id: 23, name: 'History' },
          { id: 21, name: 'Sports' }
        ]);
      })
    );
  }

  /**
   * Fetches quiz questions based on user settings (amount, category, difficulty).
   */
  fetchQuestions(settings: QuizSettings): Observable<Question[]> {
    let params = new HttpParams().set('amount', (settings.amount || 10).toString());

    if (settings.category && settings.category > 0) {
      params = params.set('category', settings.category.toString());
    }

    if (settings.difficulty && settings.difficulty.trim() !== '' && settings.difficulty !== 'any') {
      params = params.set('difficulty', settings.difficulty.toLowerCase());
    }

    return this.http.get<OpenTDBResponse>(this.baseUrl, { params }).pipe(
      map((response) => {
        if (!response || !response.results || response.results.length === 0) {
          return this.getPreparedFallbackQuestions(settings.amount);
        }

        return response.results.map((raw) => {
          const question: Question = {
            category: this.decodeHTML(raw.category),
            type: raw.type,
            difficulty: raw.difficulty,
            question: this.decodeHTML(raw.question),
            correct_answer: this.decodeHTML(raw.correct_answer),
            incorrect_answers: raw.incorrect_answers.map((ans) => this.decodeHTML(ans))
          };
          question.all_answers = this.shuffleAnswers(question);
          return question;
        });
      }),
      catchError((error) => {
        console.warn('Failed to fetch questions from OpenTDB API, using fallbacks.', error);
        return of(this.getPreparedFallbackQuestions(settings.amount));
      })
    );
  }

  /**
   * Combines correct answer and incorrect answers, then shuffles them.
   */
  shuffleAnswers(question: Question): string[] {
    const answers = [question.correct_answer, ...question.incorrect_answers];
    return this.shuffle(answers);
  }

  /**
   * Decodes HTML entities commonly found in OpenTDB responses.
   */
  decodeHTML(html: string): string {
    if (!html) {
      return '';
    }

    try {
      if (typeof DOMParser !== 'undefined') {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc.documentElement.textContent || '';
      } else if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = html;
        return textarea.value;
      }
    } catch {
      // Fall through to regex replacements
    }

    // Comprehensive fallback entity decoder
    return html
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&rsquo;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/&ldquo;/g, '"')
      .replace(/&rdquo;/g, '"')
      .replace(/&eacute;/g, 'é')
      .replace(/&oacute;/g, 'ó')
      .replace(/&uuml;/g, 'ü')
      .replace(/&deg;/g, '°')
      .replace(/&hellip;/g, '...')
      .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
      .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  }

  /**
   * Fisher-Yates shuffle algorithm to randomly shuffle an array.
   */
  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Returns prepared fallback questions with decoded text and shuffled answers.
   */
  private getPreparedFallbackQuestions(amount: number = 5): Question[] {
    const list = this.fallbackQuestions.slice(0, amount).map((q) => {
      const question: Question = {
        category: this.decodeHTML(q.category),
        type: q.type,
        difficulty: q.difficulty,
        question: this.decodeHTML(q.question),
        correct_answer: this.decodeHTML(q.correct_answer),
        incorrect_answers: q.incorrect_answers.map((ans) => this.decodeHTML(ans))
      };
      question.all_answers = this.shuffleAnswers(question);
      return question;
    });
    return this.shuffle(list);
  }
}
