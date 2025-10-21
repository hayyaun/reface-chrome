const api = (typeof chrome !== "undefined" ? chrome : browser) as typeof chrome;

export default api;
