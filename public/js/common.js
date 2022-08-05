/* global appLocalStorage fetchApi */

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

  const formLogout = document.getElementById('form_logout');
  formLogout?.addEventListener('submit', formLogoutOnSubmit);
}
