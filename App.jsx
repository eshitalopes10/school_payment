import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Payments from "./Payments";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [showRegister, setShowRegister] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogin = (t) => {
    setToken(t);
    localStorage.setItem("token", t);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const themeClass = darkMode ? "dark-mode" : "light-mode";

  return (
    <div className={`app-container ${themeClass}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {!token ? (
        showRegister ? (
          <Register onRegister={() => setShowRegister(false)} />
        ) : (
          <Login onLogin={handleLogin} onSwitch={() => setShowRegister(true)} />
        )
      ) : (
        <Payments token={token} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
