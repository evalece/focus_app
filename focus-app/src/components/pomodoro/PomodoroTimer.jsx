
import { useState } from "react";
import { usePomodoro } from "../../hooks/usePomodoro";

import TimerControls from "./TimerControls";
import TimerDisplay from "./TimerDisplay";
import SessionTimeline from "./SessionTimeline";

export default function PomodoroTimer({
  focusMinutes = 25,
  breakMinutes = 5,
  sessions = 4,
  scheduledStart,
}) {
  const timer = usePomodoro({
    focusMinutes,
    breakMinutes,
    sessions,
    scheduledStart,
  });

  // Shared layout state
  const [isExpanded, setIsExpanded] = useState(true);

  function handleStart() {
    timer.start();
    setIsExpanded(false);
  }

  function handleToggleExpand() {
    setIsExpanded(prev => !prev);
  }

  return (
    <section
      className={`pomodoro ${
        isExpanded ? "pomodoro--expanded" : "pomodoro--focus"
      }`}
    >
      <div className="pomodoro-layout">
        <div className="pomodoro-settings-area">
          <TimerControls
            settings={timer.settings}
            onSettingsChange={timer.updateSettings}
            isRunning={timer.isRunning}
            isComplete={timer.isComplete}
            isExpanded={isExpanded}
            onToggleExpand={handleToggleExpand}
            onStart={handleStart}
            onPause={timer.pause}
            onReset={timer.reset}
            onSkip={timer.skip}
          />
        </div>

        <div className="pomodoro-clock-area">
          <TimerDisplay
            remaining={timer.remaining}
            phase={timer.phase}
            currentSession={timer.currentSession}
            totalSessions={timer.settings.sessions}
            isComplete={timer.isComplete}
          />
        </div>

        <div className="pomodoro-timeline-area">
          <SessionTimeline
            timeline={timer.timeline}
            currentIndex={timer.currentIndex}
            scheduledStart={timer.settings.scheduledStart}
            scheduledEnd={timer.scheduledEnd}
            totalMinutes={timer.totalMinutes}
          />
        </div>

        <div className="pomodoro-scene-area">
          {/* Future animated scene goes here */}
        </div>
      </div>
    </section>
  );
}
