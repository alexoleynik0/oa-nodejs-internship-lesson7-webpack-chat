/* global fetchApi */

{
  const formLoginPasswordOnInput = (e) => {
    const input = e.target;
    input.value = input.value
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*?)\..*/g, '$1');
  };

  const formLoginPasswordInput = document.getElementById('form-login-password');
  formLoginPasswordInput?.addEventListener('input', formLoginPasswordOnInput);
}
{
  const formLoginOnSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    fetchApi(form.action, form.getAttribute('method'), new FormData(form))
      .then(() => {
        window.location = '/';
      })
      .catch(console.error);
  };

  const formLogin = document.getElementById('form-login');
  formLogin?.addEventListener('submit', formLoginOnSubmit);
}
