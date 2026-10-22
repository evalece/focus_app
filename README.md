# 🐚 Focus App
![focus app screenshot] (https://github.com/evalece/focus_app/blob/main/img/sample.png)

## Concept ##
**A cozy, interactive productivity companion that makes focused study sessions more enjoyable.**

Focus App combines a customizable Pomodoro timer with a visually immersive 2D study environment and CGI character(s) as study buddy!

Built with React and PixiJS, it explores how interactive graphics and thoughtful UI design can make everyday productivity tools more engaging (without getting too distracting...)


## Trade offs ##

**Prototyping With ChatGPT**
To deliver proof-of-concepts and gather user feedback sooner so I can plan sprints for later and pivot sooner (if needed), I would use AI arts (even though I am an artist and former animator myself) and AI assissted-coding (even though I am also a software engineer at the same time) at early stage. 

....(but... I do see/ foresee finetuning works needing to be done by human, even at early prototyping stages). 

## Use of AI ## 

1. Prototyping 
    - AI CGI (~ 95% +)
    - Early stage coding and readme 70-80%, with optimization, debug and refactor done by me (human). 
2. ... Not yet

**[🚀 Live Demo](https://focusapp-focus-ooon13qoi-evvva.vercel.app/)** · **[💻 GitHub Repository](https://github.com/evalece/focus_app)**

## Features

### ⏱️ Customizable Pomodoro Timer
- Configure focus durations, break durations, and session counts.
- Automatically transition between focus and break sessions.
- Pause, resume, skip, or reset sessions.
- View session progress through a visual timeline.
- Calculate total study duration and estimated completion time.
- Adjust scheduled start times using interactive controls.

### 🎨 Interactive Study Environment
- GPU-accelerated 2D rendering powered by PixiJS.
- Layered classroom background and character sprites.
- Responsive scene layout that adapts to container dimensions.
- Asynchronous texture loading and rendering lifecycle management.
- A cozy visual environment designed to accompany focused work.

### 🧩 Component-Based Architecture
- Reusable React components for timer controls, countdown display, and session timeline.
- Custom `usePomodoro` hook encapsulating timer state and session transitions.
- Separation of application logic, presentation, and graphical rendering.

## Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React 19, JavaScript (ES6+), HTML5, CSS3 |
| Graphics | PixiJS 8 |
| Build Tool | Vite 8 |
| State Management | React Hooks |
| Browser APIs | ResizeObserver, Pointer Events, Web Timers |
| Deployment | Vercel |

## Architecture

```text
src/
├── App.jsx
├── App.css
├── main.jsx
├── hooks/
│   └── usePomodoro.js
└── components/
    ├── pomodoro/
    │   ├── PomodoroTimer.jsx
    │   ├── TimerControls.jsx
    │   ├── TimerDisplay.jsx
    │   └── SessionTimeline.jsx
    └── scene/
        └── AnimatedScene.jsx
```

### Timer State Management

The `usePomodoro` custom hook manages session configuration, countdown state, phase transitions, and timer actions independently of the UI components.

The countdown uses a deadline-based approach with `Date.now()` rather than relying exclusively on interval counts, helping maintain accurate remaining-time calculations when browser timer callbacks are delayed.

### Graphics Rendering

The `AnimatedScene` component integrates PixiJS into React using `useRef` and `useEffect`.

It handles asynchronous initialization, texture loading, sprite positioning, responsive resizing, and cleanup when the component unmounts.

## Getting Started

**Prerequisites:** Node.js and npm.

1. Clone the repository:

   ```bash
   git clone https://github.com/evalece/focus_app.git
   cd focus_app/focus-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL displayed in your terminal.

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Project Status

**Early prototype — actively evolving.**

The current version demonstrates the core Pomodoro workflow, configurable sessions, and a PixiJS-powered study scene.

Potential future improvements include character animation, dynamic lighting and weather effects, additional study environments, and persistent focus statistics.

## Design Philosophy

Focus App explores the idea that productivity software can feel warm, playful, and visually engaging without distracting users from their primary goals.

The long-term vision is to create a study environment that becomes more rewarding as users maintain their focus.

---

Built with React, PixiJS, and a love for cozy study spaces. 🐚
