
import TimerControls from "./TimerControls";
import TimerDisplay from "./TimerDisplay";
import SessionTimeline from "./SessionTimeline";

export default function PomodoroTimer({
  timer,
  isExpanded,
  onToggleExpand,
  onStart,
  onReset,
}) {
  return (
    <>
      <div className="pomodoro-settings-area">
        <TimerControls
          settings={timer.settings}
          onSettingsChange={timer.updateSettings}
          isRunning={timer.isRunning}
          isComplete={timer.isComplete}
          isExpanded={isExpanded}
          onToggleExpand={onToggleExpand}
          onStart={onStart}
          onPause={timer.pause}
          onReset={onReset}
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
    </>
  );
}
