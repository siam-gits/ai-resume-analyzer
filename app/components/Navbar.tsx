import { Link } from "react-router";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      document.body.classList.toggle("dark", saved === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">RESUMIND</p>
      </Link>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link to="/upload" className="primary-button w-fit">Upload Resume</Link>
        <button
          onClick={toggleTheme}
          style={{
            padding: "0.5rem",
            borderRadius: "50%",
            background: theme === "light" ? "#e5e7eb" : "#374151",
            border: "none",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
        >
          {theme === "light" ? <Moon width={20} height={20} /> : <Sun width={20} height={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
