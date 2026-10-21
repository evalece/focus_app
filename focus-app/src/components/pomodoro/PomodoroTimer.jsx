
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

  return (
    <section className="pomodoro">
      <h2>Pomodoro Timer</h2>

      <TimerControls
        settings={timer.settings}
        onSettingsChange={timer.updateSettings}
        isRunning={timer.isRunning}
        isComplete={timer.isComplete}
        onStart={timer.start}
        onPause={timer.pause}
        onReset={timer.reset}
        onSkip={timer.skip}
      />

      <TimerDisplay
        remaining={timer.remaining}
        phase={timer.phase}
        currentSession={timer.currentSession}
        totalSessions={timer.settings.sessions}
        isComplete={timer.isComplete}
      />

      <SessionTimeline
        timeline={timer.timeline}
        currentIndex={timer.currentIndex}
        scheduledStart={timer.settings.scheduledStart}
        scheduledEnd={timer.scheduledEnd}
        totalMinutes={timer.totalMinutes}
      />
    </section>
  );
}
