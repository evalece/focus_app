
import { useRef } from "react";

// Convert "14:30" to total minutes
function toMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Convert total minutes to "14:30"
function toTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

// Current time rounded up to the next minute
function getMinimumStart() {
  const now = new Date();

  return (
    now.getHours() * 60 +
    now.getMinutes() +
    (now.getSeconds() > 0 || now.getMilliseconds() > 0 ? 1 : 0)
  );
}

export default function TimerControls({
  settings,
  onSettingsChange,
  isRunning,
  isComplete,
  isExpanded,
  onToggleExpand,
  onStart,
  onPause,
  onReset,
  onSkip,
}) {
  const {
    focusMinutes,
    breakMinutes,
    sessions,
    scheduledStart,
  } = settings;

  // Temporary pointer position for dragging
  const dragRef = useRef(null);

  function changeSetting(name, value) {
    onSettingsChange({ [name]: value });
  }

  // Do not allow a scheduled start earlier than now
  function changeStartTime(value) {
    if (!value) return;

    const minimum = getMinimumStart();

    // No valid whole-minute start time remains today
    if (minimum > 1439) return;

    const selected = toMinutes(value);

    const valid = Math.max(
      minimum,
      Math.min(1439, selected)
    );

    changeSetting("scheduledStart", toTime(valid));
  }

  function setStartToNow() {
    const minimum = getMinimumStart();

    if (minimum <= 1439) {
      changeSetting("scheduledStart", toTime(minimum));
    }
  }

  // Drag up to increase time, down to decrease
  function handlePointerDown(e) {
    if (isRunning || isComplete) return;

    dragRef.current = {
      startY: e.clientY,
      startMinutes: toMinutes(scheduledStart),
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e) {
    if (!dragRef.current) return;

    const { startY, startMinutes } = dragRef.current;

    // Every 10 pixels adjusts the time by 5 minutes
    const steps = Math.trunc((startY - e.clientY) / 10);
    const adjustment = steps * 5;

    const minimum = getMinimumStart();

    if (minimum > 1439) return;

    const next = Math.max(
      minimum,
      Math.min(1439, startMinutes + adjustment)
    );

    changeSetting("scheduledStart", toTime(next));
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  // Parent handles automatic collapse on Start
  function handleStartPause() {
    if (isRunning) {
      onPause();
    } else {
      onStart();
    }
  }

  return (
    <div className="timer-settings">
      {/* Collapsible settings header */}
      <button
        type="button"
        className="settings-toggle"
        aria-expanded={isExpanded}
        aria-controls="timer-settings-content"
        onClick={onToggleExpand}
      >
        <span>Timer Settings</span>

        <span className="settings-chevron">
          {isExpanded ? "▲" : "▼"}
        </span>
      </button>

      {/* Settings content */}
      {isExpanded && (
        <div id="timer-settings-content">
          {/* Focus duration */}
          <div className="setting">
            <label>Focus duration (min)</label>

            <button
              type="button"
              disabled={isRunning || focusMinutes <= 5}
              onClick={() =>
                changeSetting("focusMinutes", focusMinutes - 5)
              }
            >
              −
            </button>

            <span>{focusMinutes}</span>

            <button
              type="button"
              disabled={isRunning || focusMinutes >= 180}
              onClick={() =>
                changeSetting("focusMinutes", focusMinutes + 5)
              }
            >
              +
            </button>
          </div>

          {/* Break duration */}
          <div className="setting">
            <label>Break duration (min)</label>

            <button
              type="button"
              disabled={isRunning || breakMinutes <= 1}
              onClick={() =>
                changeSetting("breakMinutes", breakMinutes - 1)
              }
            >
              −
            </button>

            <span>{breakMinutes}</span>

            <button
              type="button"
              disabled={isRunning || breakMinutes >= 60}
              onClick={() =>
                changeSetting("breakMinutes", breakMinutes + 1)
              }
            >
              +
            </button>
          </div>

          {/* Number of focus sessions */}
          <div className="setting">
            <label>Number of focus sessions</label>

            <button
              type="button"
              disabled={isRunning || sessions <= 1}
              onClick={() =>
                changeSetting("sessions", sessions - 1)
              }
            >
              −
            </button>

            <span>{sessions}</span>

            <button
              type="button"
              disabled={isRunning || sessions >= 12}
              onClick={() =>
                changeSetting("sessions", sessions + 1)
              }
            >
              +
            </button>
          </div>

          {/* Scheduled start */}
          <div className="setting">
            <label htmlFor="scheduled-start">
              Scheduled start
            </label>

            <input
              id="scheduled-start"
              type="time"
              value={scheduledStart}
              disabled={isRunning || isComplete}
              onChange={(e) => changeStartTime(e.target.value)}
            />

            {/* Draggable time handle */}
            <div
              className="time-drag-handle"
              role="button"
              tabIndex={isRunning || isComplete ? -1 : 0}
              aria-label="Drag up or down to adjust start time"
              aria-disabled={isRunning || isComplete}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onKeyDown={(e) => {
                if (isRunning || isComplete) return;

                if (e.key === "ArrowUp") {
                  e.preventDefault();

                  changeStartTime(
                    toTime(
                      Math.min(
                        1439,
                        toMinutes(scheduledStart) + 5
                      )
                    )
                  );
                }

                if (e.key === "ArrowDown") {
                  e.preventDefault();

                  changeStartTime(
                    toTime(
                      Math.max(
                        0,
                        toMinutes(scheduledStart) - 5
                      )
                    )
                  );
                }
              }}
              title="Drag up/down to adjust time"
            >
              ↕
            </div>

            <button
              type="button"
              disabled={isRunning || isComplete}
              onClick={setStartToNow}
            >
              Now
            </button>
          </div>
        </div>
      )}

      {/* Always visible timer controls */}
      <div className="timer-controls">
        <button
          type="button"
          disabled={isComplete}
          onClick={handleStartPause}
        >
          {isRunning ? "Pause" : "Start"}
        </button>

        <button
          type="button"
          onClick={onReset}
        >
          Reset
        </button>

        <button
          type="button"
          disabled={isComplete}
          onClick={onSkip}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
