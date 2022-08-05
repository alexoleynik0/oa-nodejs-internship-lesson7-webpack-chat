/* global appVariables fetchApi */

{
  const windowOnLoad = () => {
    fetchApi(`${appVariables.apiBaseUrl}/users/me`)
      .then(console.log)
      .catch(console.error);
  };

  window.addEventListener('load', windowOnLoad);
}
