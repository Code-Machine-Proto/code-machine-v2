import { createSignal } from "solid-js";

const STORAGE_KEY = "codemachine-theme";

type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

const [theme, setThemeSignal] = createSignal<Theme>(getInitialTheme());

function applyTheme(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem(STORAGE_KEY, t);
}

// Apply on load
applyTheme(theme());

export function useTheme() {
  return {
    theme,
    isDark: () => theme() === "dark",
    toggle: () => {
      const next = theme() === "dark" ? "light" : "dark";
      setThemeSignal(next);
      applyTheme(next);
    },
  };
}
