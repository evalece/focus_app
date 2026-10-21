
import PomodoroTimer from "./components/pomodoro/PomodoroTimer";
import "./App.css";

export default function App() {
  return (
    <main className="app">
      <h1>Focus App 🐚</h1>
      <p>Your cozy productivity companion</p>

      <PomodoroTimer
        focusMinutes={25}
        breakMinutes={5}
        sessions={4}
      />
    </main>
  );
}
