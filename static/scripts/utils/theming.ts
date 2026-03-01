import { Utils } from ".";

const Theme = {
  apply: (hue: string, chroma: string, isDark: boolean) => {
    const root = document.documentElement;

    root.style.setProperty("--hue", hue);
    root.style.setProperty("--chroma-factor", chroma);
    document.body.classList.toggle("dark", isDark);
  },

  setupListeners: () => {
    const hue = document.querySelector("#hue-slider") as HTMLInputElement;
    const chroma = document.querySelector("#chroma-slider") as HTMLInputElement;
    const toggle = document.querySelector("#light-dark") as HTMLInputElement;

    hue.value = Utils.Storage.getPrimaryColor() as string;
    chroma.value = Utils.Storage.getPrimaryChroma() as string;
    toggle.checked = Utils.Storage.getDarkMode();

    Theme.apply(hue.value, chroma.value, toggle.checked);

    hue.addEventListener("input", () => {
      Theme.apply(hue.value, chroma.value, toggle.checked);
      Utils.Storage.savePrimaryColor(hue.value);
    });

    chroma.addEventListener("input", () => {
      Theme.apply(hue.value, chroma.value, toggle.checked);
      Utils.Storage.savePrimaryChroma(chroma.value);
    });

    toggle.addEventListener("change", () => {
      Theme.apply(hue.value, chroma.value, toggle.checked);
      Utils.Storage.saveDarkMode(toggle.checked);
    });
  },
};

export { Theme };
