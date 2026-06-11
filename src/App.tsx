import { useEffect, useState } from "react";
import Landing from "./Landing";
import Dashboard from "./Dashboard";

type View = "landing" | "app";

export default function App() {
  const [view, setView] = useState<View>(
    () => (window.location.hash === "#app" ? "app" : "landing")
  );

  useEffect(() => {
    window.location.hash = view === "app" ? "app" : "";
    window.scrollTo(0, 0);
  }, [view]);

  return view === "landing" ? (
    <Landing onEnter={() => setView("app")} />
  ) : (
    <Dashboard onExit={() => setView("landing")} />
  );
}
