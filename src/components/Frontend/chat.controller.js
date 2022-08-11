function chatPage(_req, res) {
  res.render('pages/chat.ejs');
}

const ChatController = {
  chatPage,
};

module.exports = ChatController;
