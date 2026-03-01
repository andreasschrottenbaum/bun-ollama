import { dateTimeFormat } from "./datetime";
import { copyTargetToClipboard } from "./copyToClipboard";
import { getMessage } from "./message";
import { Storage } from "./storage";
import { Ollama } from "./api";
import { UI } from "./ui";
import { setupMarkdown } from "./markdown";
import { Theme } from "./theming";

const Utils = {
  copyTargetToClipboard,
  dateTimeFormat,
  getMessage,
  setupMarkdown,
  Ollama,
  Storage,
  Theme,
  UI,
};

export { Utils };
