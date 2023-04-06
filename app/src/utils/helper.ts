export const redirect = (url: string) => window.open(url, "_blank");

export const truncate = (text: string, max = 15) =>
  text && text.length > max
    ? text.slice(0, max).split(" ").slice(0, -1).join(" ")
    : text;
