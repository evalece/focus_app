
import { useState } from "react";
import { usePomodoro } from "./hooks/usePomodoro";
import PomodoroTimer from "./components/pomodoro/PomodoroTimer";
import AnimatedScene from "./components/scene/AnimatedScene";
import "./App.css";

export default function App() {
  // Single source of truth for the timer
  const timer = usePomodoro({
    focusMinutes: 25,
    breakMinutes: 5,
    sessions: 4,
  });

  // UI state is independent of timer state
  const [isExpanded, setIsExpanded] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  function handleStart() {
    timer.start();
    setHasStarted(true);
    setIsExpanded(false);
  }

  function handleReset() {
    timer.reset();
    setHasStarted(false);
    setIsExpanded(true);
  }

  function handleToggleExpand() {
    setIsExpanded(prev => !prev);
  }

  return (
    <main className="app">
      <h1>Focus App 🐚</h1>
      <p>Your cozy study companion</p>

      <section
        className={`pomodoro ${
          isExpanded
            ? "pomodoro--expanded"
            : "pomodoro--focus"
        }`}
      >
        <div className="pomodoro-layout">
          <PomodoroTimer
            timer={timer}
            isExpanded={isExpanded}
            onToggleExpand={handleToggleExpand}
            onStart={handleStart}
            onReset={handleReset}
          />

          <div className="pomodoro-scene-area">
            {hasStarted && (
              <AnimatedScene isRunning={timer.isRunning} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
