const timestampFormatter = new Intl.DateTimeFormat(navigator.language, {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/**
 * Formats a UNIX Timestamp in a human readable string
 * @param timestamp UNIX timestamp
 * @returns formatted string
 */
const dateTimeFormat = (timestamp: number): string => {
  return timestampFormatter.format(timestamp);
};

export { dateTimeFormat };
