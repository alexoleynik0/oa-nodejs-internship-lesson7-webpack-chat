/* global appLocalStorage fetchApi io */

{
  const formLogoutOnSubmit = (e) => {
    e.preventDefault();
    const data = {
      userId: appLocalStorage.getItem('userId'),
      oldRefreshToken: appLocalStorage.getItem('refreshToken'),
    };
    const form = e.target;
    fetchApi(form.action, form.getAttribute('method'), data)
      .then(() => {
        window.location = '/login';
      })
      .catch(console.error);
  };

  const formLogout = document.getElementById('form-logout');
  formLogout?.addEventListener('submit', formLogoutOnSubmit);
}

if (appLocalStorage.getItem('userId')) {
  const socket = io({
    query: {
      roomName: appLocalStorage.getItem('userId'),
    },
  });

  window.socket = socket;
}
