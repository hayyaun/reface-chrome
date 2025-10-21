const api = (typeof browser !== "undefined" ? browser : chrome) as typeof chrome;

export default api;
