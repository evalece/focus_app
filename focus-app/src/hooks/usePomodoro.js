
import { useEffect, useState } from "react";

function getCurrentTime() {
  const now = new Date();

  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;
}

function buildTimeline(settings) {
  const timeline = [];

  for (let i = 0; i < settings.sessions; i++) {
    timeline.push({
      type: "focus",
      duration: settings.focusMinutes,
    });

    if (i < settings.sessions - 1) {
      timeline.push({
        type: "break",
        duration: settings.breakMinutes,
      });
    }
  }

  return timeline;
}

export function usePomodoro({
  focusMinutes = 25,
  breakMinutes = 5,
  sessions = 4,
  scheduledStart,
} = {}) {
  const [settings, setSettings] = useState(() => ({
    focusMinutes,
    breakMinutes,
    sessions,
    scheduledStart: scheduledStart ?? getCurrentTime(),
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [remaining, setRemaining] = useState(focusMinutes * 60);
  const [deadline, setDeadline] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const timeline = buildTimeline(settings);
  const current = timeline[currentIndex];

  const isRunning = deadline !== null && !isComplete;

  // Keep the displayed countdown aligned with real time.
  useEffect(() => {
    if (deadline === null) return;

    const tick = () => {
      setRemaining(
        Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      );
    };

    tick();

    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [deadline]);

  // Advance when the current interval finishes.
  useEffect(() => {
    if (remaining !== 0 || deadline === null) return;

    if (currentIndex < timeline.length - 1) {
      const nextIndex = currentIndex + 1;

      setCurrentIndex(nextIndex);
      setRemaining(timeline[nextIndex].duration * 60);
      setDeadline(
        Date.now() + timeline[nextIndex].duration * 60 * 1000
      );
    } else {
      setDeadline(null);
      setIsComplete(true);
    }
  }, [remaining, deadline, currentIndex]);

  function start() {
    if (isComplete || deadline !== null) return;

    setDeadline(Date.now() + remaining * 1000);
  }

  function pause() {
    if (deadline === null) return;

    setRemaining(
      Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
    );
    setDeadline(null);
  }

  function reset() {
    setDeadline(null);
    setCurrentIndex(0);
    setRemaining(settings.focusMinutes * 60);
    setIsComplete(false);
  }

  function skip() {
    if (isComplete) return;

    if (currentIndex < timeline.length - 1) {
      const nextIndex = currentIndex + 1;
      const duration = timeline[nextIndex].duration * 60;

      setCurrentIndex(nextIndex);
      setRemaining(duration);

      if (isRunning) {
        setDeadline(Date.now() + duration * 1000);
      }
    } else {
      setDeadline(null);
      setRemaining(0);
      setIsComplete(true);
    }
  }

  function updateSettings(patch) {
    // Prevent changes to the schedule while running.
    if (isRunning) return;

    const next = { ...settings, ...patch };

    next.focusMinutes = Math.max(
      5,
      Math.min(180, next.focusMinutes)
    );
    next.breakMinutes = Math.max(
      1,
      Math.min(60, next.breakMinutes)
    );
    next.sessions = Math.max(1, Math.min(12, next.sessions));

    setSettings(next);
    setCurrentIndex(0);
    setRemaining(next.focusMinutes * 60);
    setIsComplete(false);
  }

  const totalMinutes =
    settings.sessions * settings.focusMinutes +
    (settings.sessions - 1) * settings.breakMinutes;

  const [hour, minute] = settings.scheduledStart
    .split(":")
    .map(Number);

  const endDate = new Date();
  endDate.setHours(hour, minute + totalMinutes, 0, 0);

  const scheduledEnd = endDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    settings,
    updateSettings,
    timeline,
    currentIndex,
    remaining,
    phase: current.type,
    currentSession: Math.floor(currentIndex / 2) + 1,
    totalMinutes,
    scheduledEnd,
    isRunning,
    isComplete,
    start,
    pause,
    reset,
    skip,
  };
}
