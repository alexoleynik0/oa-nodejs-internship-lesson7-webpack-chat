/* global appVariables */

{
  const appLocalStorage = {
    makeKey(key) {
      return `${appVariables.localStoragePrefix}${key}`;
    },

    getItem(key) {
      return localStorage.getItem(this.makeKey(key));
    },
    setItem(key, value) {
      localStorage.setItem(this.makeKey(key), value);
    },
    removeItem(key) {
      localStorage.removeItem(this.makeKey(key));
    },
  };

  window.appLocalStorage = appLocalStorage;
}
