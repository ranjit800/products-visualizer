"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
    theme: "dark",
    setTheme: () => { },
    actualTheme: "dark",
});

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
};

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState("dark"); // "light", "dark", or "auto"
    const [actualTheme, setActualTheme] = useState("dark"); // resolved theme

    // Initialize theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "dark";
        setThemeState(savedTheme);
    }, []);

    // Handle system preference changes for auto mode
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = () => {
            if (theme === "auto") {
                const systemTheme = mediaQuery.matches ? "dark" : "light";
                setActualTheme(systemTheme);
                applyTheme(systemTheme);
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [theme]);

    // Apply theme whenever it changes
    useEffect(() => {
        let resolvedTheme = theme;

        if (theme === "auto") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            resolvedTheme = mediaQuery.matches ? "dark" : "light";
        }

        setActualTheme(resolvedTheme);
        applyTheme(resolvedTheme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const applyTheme = (resolvedTheme) => {
        const root = document.documentElement;
        if (resolvedTheme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    };

    const setTheme = (newTheme) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeContext;
