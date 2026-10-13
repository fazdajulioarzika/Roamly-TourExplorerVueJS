const BASE = "Roamly — Travel Explorer & Trip Planner";
export const setTitle = (t?: string) => {
  document.title = t ? `${t} — Roamly` : BASE;
};
