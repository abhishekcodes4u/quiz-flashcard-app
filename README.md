# QuizFlash ⚡ - Mobile Quiz & Flashcard App

A hybrid mobile application built with **Ionic 8 + Angular 18 + Capacitor 6**, converting the web-based [Build-A-Quiz-App-With-HTML-CSS-and-JavaScript](https://github.com/jamesqquick/Build-A-Quiz-App-With-HTML-CSS-and-JavaScript) GitHub project into a full-featured mobile application.

## 📱 Screenshots & Features

### 🏠 Home Screen
- Vibrant gradient landing page with quiz settings configuration
- Select number of questions (5-50), category, and difficulty
- Quick navigation to Flashcards and High Scores

### 📝 Quiz Mode
- Real-time trivia questions from [Open Trivia Database](https://opentdb.com/)
- 30-second countdown timer per question
- Haptic feedback on answer selection (on mobile devices)
- Animated correct/incorrect feedback with color-coded answers
- Progress bar tracking quiz completion

### 🃏 Flashcard Mode
- 24+ built-in flashcards across 4 categories (General Knowledge, Science, History, Geography)
- 3D flip animation to reveal answers
- Swipe navigation between cards
- Create custom flashcards with category tagging
- Track learned vs unlearned cards with progress indicator
- Filter by category

### 🏆 Results & High Scores
- Circular progress indicator with animated score display
- Confetti celebration for high scores (>80%)
- Save scores with player name to persistent leaderboard
- Share results via Web Share API
- Gold/Silver/Bronze ranking for top 3 scores

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| **Ionic Framework** | 8.x | UI Components & Mobile-first Design |
| **Angular** | 18.x | Application Framework (Standalone Components) |
| **Capacitor** | 6.x | Native Bridge (iOS/Android) |
| **TypeScript** | 5.4.x | Type-safe JavaScript |
| **SCSS** | - | Styling & Theming |
| **Open Trivia DB** | API | Quiz Questions Source |

## 📁 Project Structure

```
quiz-flashcard-app/
├── src/
│   ├── app/
│   │   ├── models/
│   │   │   └── quiz.model.ts          # Interfaces (Question, Flashcard, HighScore, etc.)
│   │   ├── pages/
│   │   │   ├── home/                  # Landing page with quiz settings
│   │   │   ├── quiz/                  # Quiz gameplay with timer
│   │   │   ├── flashcards/            # Flashcard viewer with 3D flip
│   │   │   ├── results/               # Score display with confetti
│   │   │   └── highscores/            # Leaderboard with rankings
│   │   ├── services/
│   │   │   ├── quiz.service.ts        # API integration with Open Trivia DB
│   │   │   ├── storage.service.ts     # Capacitor Preferences for persistence
│   │   │   └── flashcard.service.ts   # Flashcard CRUD operations
│   │   ├── app.component.ts           # Root component
│   │   └── app.routes.ts              # Lazy-loaded route definitions
│   ├── theme/
│   │   └── variables.scss             # Ionic CSS custom properties
│   ├── global.scss                    # Global styles & Ionic CSS imports
│   ├── index.html                     # Entry HTML with mobile meta tags
│   └── main.ts                        # Angular bootstrap configuration
├── angular.json                       # Angular CLI configuration
├── capacitor.config.ts                # Capacitor native configuration
├── ionic.config.json                  # Ionic CLI configuration
├── package.json                       # Dependencies & scripts
├── tsconfig.json                      # TypeScript configuration
└── tsconfig.app.json                  # App-specific TS config
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **npm** 9+
- **Android Studio** (for Android builds)
- **Xcode** (for iOS builds, macOS only)

### Installation

```bash
# Clone or navigate to the project
cd quiz-flashcard-app

# Install dependencies
npm install

# Run in browser (development)
ionic serve

# Build for production
ionic build --prod
```

### Native Mobile Builds

```bash
# Add Android platform
npx cap add android

# Add iOS platform (macOS only)
npx cap add ios

# Sync web assets to native projects
npx cap sync

# Open in Android Studio
npx cap open android

# Open in Xcode
npx cap open ios
```

## 🎨 Theming

The app uses a vibrant color palette defined in `src/theme/variables.scss`:

| Color | Hex | Usage |
|---|---|---|
| Primary | `#6C5CE7` | Main purple accent |
| Secondary | `#00CEC9` | Teal highlights |
| Tertiary | `#FD79A8` | Pink accents |
| Success | `#00B894` | Correct answers |
| Warning | `#FDCB6E` | Timer warnings |
| Danger | `#E17055` | Wrong answers |

Dark mode is fully supported via `prefers-color-scheme` media query.

## 🌐 API Reference

This app uses the **Open Trivia Database (OpenTDB)** API:
- **Questions**: `https://opentdb.com/api.php?amount={n}&category={id}&difficulty={level}`
- **Categories**: `https://opentdb.com/api_category.php`

No API key required. Free and open-source.

## 📋 Original Web Project

**Repository**: [jamesqquick/Build-A-Quiz-App-With-HTML-CSS-and-JavaScript](https://github.com/jamesqquick/Build-A-Quiz-App-With-HTML-CSS-and-JavaScript)

**Original Features** (Web):
- Fetch trivia questions from API
- Track score
- Save high scores to localStorage

**Mobile App Enhancements**:
- ✅ Native mobile UI with Ionic components
- ✅ Haptic feedback on interactions
- ✅ Flashcard study mode with 3D animations
- ✅ Per-question countdown timer
- ✅ Category and difficulty selection
- ✅ Persistent storage via Capacitor Preferences
- ✅ Share results via native share sheet
- ✅ Dark mode support
- ✅ Touch gestures (swipe for flashcards)
- ✅ Confetti celebration animations
- ✅ PWA-ready for installable web app

## 📄 License

This project is for educational/assignment purposes. The original web project is by [James Q Quick](https://github.com/jamesqquick).
