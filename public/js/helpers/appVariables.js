{
  const appVariables = {};

  const getAppVariablesItem = (variableKey) => {
    try {
      return document.querySelector(`meta[itemprop="appVariables.${variableKey}"]`).getAttribute('content');
    } catch {
      // eslint-disable-next-line no-console
      console.error(`appVariables with key "${variableKey}" failed to read.`);
      return '';
    }
  };

  appVariables.appName = getAppVariablesItem('appName');
  appVariables.apiBaseUrl = getAppVariablesItem('apiBaseUrl');

  appVariables.localStoragePrefix = `${appVariables.appName}.`;

  window.appVariables = appVariables;
}
