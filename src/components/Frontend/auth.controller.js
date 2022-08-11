function registerPage(_req, res) {
  res.render('pages/login.ejs', { isLoginPage: false });
}

function loginPage(_req, res) {
  res.render('pages/login.ejs', { isLoginPage: true });
}

const AuthController = {
  registerPage,
  loginPage,
};

module.exports = AuthController;
