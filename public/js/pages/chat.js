{
  const documentOnLoad = () => {
    fetchApi(`${appVariables.apiBaseUrl}/users/me`)
      .then(console.log)
      .catch(console.error);
  };

  const peopleList = document.getElementById('people-list');
  document.addEventListener('DOMContentLoaded', documentOnLoad);
}
