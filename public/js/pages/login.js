{
  const formLoginPasswordOnInput = (e) => {
    const input = e.target;
    input.value = input.value
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*?)\..*/g, '$1');
  };

  const formLoginPasswordInput = document.getElementById('form_login_password');
  formLoginPasswordInput?.addEventListener('input', formLoginPasswordOnInput);
}
{
  const formLoginOnSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    fetchApi(form.action, form.getAttribute('method'), new FormData(form))
      .then(() => {
        location = '/';
      })
      .catch(console.error);
  };

  const formLogin = document.getElementById('form_login');
  formLogin?.addEventListener('submit', formLoginOnSubmit);
}
