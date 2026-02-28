const KEYS = {
  HISTORY: "lastPrompts",
  PRIMARY_COLOR: "primaryHue",
  PRIMARY_CHROMA: "primaryChroma",
  PREFERRED_MODEL: "preferredModel",
};

const Storage = {
  getHistory: () => JSON.parse(localStorage.getItem(KEYS.HISTORY) || "[]"),
  saveHistory: (history: any[]) =>
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history.slice(-20))),

  getPrimaryColor: (fallback = 0) =>
    localStorage.getItem(KEYS.PRIMARY_COLOR) || fallback,
  savePrimaryColor: (color: string) =>
    localStorage.setItem(KEYS.PRIMARY_COLOR, color),

  getPrimaryChroma: (fallback = 1) =>
    localStorage.getItem(KEYS.PRIMARY_CHROMA) || fallback,
  savePrimaryChroma: (color: string) =>
    localStorage.setItem(KEYS.PRIMARY_CHROMA, color),

  getPreferredModel: () => localStorage.getItem(KEYS.PREFERRED_MODEL),
  savePreferredModel: (model: string) =>
    localStorage.setItem(KEYS.PREFERRED_MODEL, model),
};

export { Storage };
