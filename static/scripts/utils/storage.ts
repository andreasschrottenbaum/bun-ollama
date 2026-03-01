const KEYS = {
  HISTORY: "lastPrompts",
  PRIMARY_COLOR: "primaryHue",
  PRIMARY_CHROMA: "primaryChroma",
  PREFERRED_DARKMODE: "preferredDarkmode",
  PREFERRED_MODEL: "preferredModel",
};

interface Prompt {
  model: string;
  prompt: string;
  promptTimestamp: number;
  response: string;
  timestamp: number;
}

const Storage = {
  getHistory: () =>
    JSON.parse(localStorage.getItem(KEYS.HISTORY) || "[]") as Prompt[],
  saveHistory: (history: Prompt[]) =>
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history.slice(-20))),
  clearHistory: () => localStorage.setItem(KEYS.HISTORY, JSON.stringify([])),

  getPrimaryColor: (fallback = 245) =>
    localStorage.getItem(KEYS.PRIMARY_COLOR) ?? fallback,
  savePrimaryColor: (color: string) =>
    localStorage.setItem(KEYS.PRIMARY_COLOR, color),

  getPrimaryChroma: (fallback = 0.25) =>
    localStorage.getItem(KEYS.PRIMARY_CHROMA) ?? fallback,
  savePrimaryChroma: (color: string) =>
    localStorage.setItem(KEYS.PRIMARY_CHROMA, color),

  getDarkMode: () => {
    const systemPreference =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    return (
      JSON.parse(localStorage.getItem(KEYS.PREFERRED_DARKMODE) || "null") ??
      systemPreference
    );
  },
  saveDarkMode: (dark: boolean) =>
    localStorage.setItem(KEYS.PREFERRED_DARKMODE, JSON.stringify(dark)),

  getPreferredModel: () => localStorage.getItem(KEYS.PREFERRED_MODEL),
  savePreferredModel: (model: string) =>
    localStorage.setItem(KEYS.PREFERRED_MODEL, model),
};

export { Storage };
