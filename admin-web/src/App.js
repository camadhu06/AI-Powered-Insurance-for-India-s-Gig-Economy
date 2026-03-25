import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";

function App() {
  const [step, setStep] = useState("login");

  if (step === "login") {
    return <Login onLogin={() => setStep("welcome")} />;
  }

  if (step === "welcome") {
    return <Welcome onFinish={() => setStep("dashboard")} />;
  }

  return <Dashboard />;
}

export default App;