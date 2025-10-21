const api = (typeof browser !== "undefined" ? browser : chrome) as typeof browser;

export default api;
