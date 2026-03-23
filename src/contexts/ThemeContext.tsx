import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ThemeName = "light" | "dark" | "banking";
export type FontFamily = "lexend" | "inter";
export type Density = "comfortable" | "compact";

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  font: FontFamily;
  setFont: (f: FontFamily) => void;
  density: Density;
  setDensity: (d: Density) => void;
  accentColor: string;
  setAccentColor: (c: string) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => (localStorage.getItem("rp-theme") as ThemeName) || "light");
  const [font, setFontState] = useState<FontFamily>(() => (localStorage.getItem("rp-font") as FontFamily) || "lexend");
  const [density, setDensityState] = useState<Density>(() => (localStorage.getItem("rp-density") as Density) || "comfortable");
  const [accentColor, setAccentColorState] = useState(() => localStorage.getItem("rp-accent") || "blue");

  const setTheme = (t: ThemeName) => { setThemeState(t); localStorage.setItem("rp-theme", t); };
  const setFont = (f: FontFamily) => { setFontState(f); localStorage.setItem("rp-font", f); };
  const setDensity = (d: Density) => { setDensityState(d); localStorage.setItem("rp-density", d); };
  const setAccentColor = (c: string) => { setAccentColorState(c); localStorage.setItem("rp-accent", c); };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "banking");
    root.classList.add(theme);
    root.setAttribute("data-font", font);
    root.setAttribute("data-density", density);
  }, [theme, font, density]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, font, setFont, density, setDensity, accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
