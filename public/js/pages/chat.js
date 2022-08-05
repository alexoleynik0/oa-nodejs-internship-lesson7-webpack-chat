/* global ChatComponent */

{
  const windowOnLoad = () => {
    const roomsList = document.getElementById('chat-rooms-list');
    const roomHeader = document.getElementById('chat-room-header');
    const messagesList = document.getElementById('chat-room-messages-list');
    const sendForm = document.getElementById('chat-room-send-form');
    const searchForm = document.getElementById('chat-search-form');
    // eslint-disable-next-line no-new
    new ChatComponent(roomsList, roomHeader, messagesList, sendForm, searchForm);
  };

  window.addEventListener('load', windowOnLoad);
}
