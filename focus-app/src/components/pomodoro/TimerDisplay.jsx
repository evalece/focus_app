
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function TimerDisplay({
  remaining,
  phase,
  currentSession,
  totalSessions,
  isComplete,
}) {
  return (
    <div className="timer-display">
      <p>
        Session {currentSession} / {totalSessions}
      </p>

      <h3>
        {isComplete
          ? "All sessions completed!"
          : phase === "focus"
            ? "Focus Time"
            : "Break Time"}
      </h3>

      <h1>{formatTime(remaining)}</h1>
    </div>
  );
}
