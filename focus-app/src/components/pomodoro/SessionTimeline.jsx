
export default function SessionTimeline({
  timeline,
  currentIndex,
  scheduledStart,
  scheduledEnd,
  totalMinutes,
}) {
  return (
    <div className="session-schedule">
      <p>
        Scheduled: {scheduledStart} – {scheduledEnd}
      </p>

      <p>Total duration: {totalMinutes} minutes</p>

      <div className="timeline">
        {timeline.map((segment, index) => (
          <div
            key={index}
            title={`${segment.type}: ${segment.duration} min`}
            style={{
              flex: segment.duration,
              height: "24px",
              backgroundColor:
                segment.type === "focus" ? "#4D9A84" : "#E9BA70",
              opacity: index < currentIndex ? 0.35 : 1,
              outline:
                index === currentIndex ? "2px solid #333" : "none",
            }}
          />
        ))}
      </div>

      <div className="timeline-legend">
        <span>🟢 Focus</span>
        <span>🟠 Break</span>
      </div>
    </div>
  );
}
