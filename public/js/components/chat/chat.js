/* global debounce appVariables fetchApi jdenticon */

{
  const timestampToHuman = (timestamp) => (new Date(timestamp)).toLocaleString();

  const generateUserAvatarHTML = (user, size) => (`
    <svg
      class="avatar"
      data-jdenticon-value="${user.id || user}"
      width="${size}"
      height="${size}"
    >
      <image
        xlink:href="/static/img/favicon.png"
        src="/static/img/favicon.png"
        alt="avatar"
        width="${size}"
        height="${size}"
      />
    </svg>
  `);

  const generateRoomListItemHTML = (room) => (`
    <li class="clearfix chat-rooms-list-item" data-room-id="${room.id}">
      ${generateUserAvatarHTML(room.users[0] || room.creator, 55)}
      <div class="about">
        <div class="name">${room.users[0]?.nickname || 'My notes'}</div>
        <div class="status"></div>
        <div class="last-message">${room.lastMessage !== undefined ? room.lastMessage.text : ''}</div>
      </div>
    </li>
  `);

  const generateSearchResultListItemHTML = (user) => (`
    <li class="clearfix chat-rooms-list-item" data-user-id="${user.id}">
      ${generateUserAvatarHTML(user, 55)}
      <div class="about">
        <div class="name">${user.nickname}</div>
        <div class="status"></div>
        <div class="last-message">[click to create a Room]</div>
      </div>
    </li>
  `);

  const generateRoomHeaderHTML = (room) => (`
    ${generateUserAvatarHTML(room.users[0] || room.creator, 55)}
    <div class="chat-about">
      <div class="chat-with">${room.users[0] !== undefined ? `Room with ${room.users[0].nickname}` : 'My notes'}</div>
      <div class="chat-num-messages">already ${(room.messagesCount || 0).toLocaleString(undefined)} messages</div>
    </div>
  `);

  const generateMessageListItemHTML = (message, user, isMeCreator) => (`
    <li class="clearfix chat-room-messages-list-item" data-message-id="${message.id}">
      <div class="message-data ${isMeCreator ? 'text-right' : ''}">
        <span class="message-data-time">${timestampToHuman(message.createdAt)}</span> &nbsp; &nbsp;
        <span class="message-data-name">${user.nickname}</span>
      </div>
      <div class="message ${isMeCreator ? 'other-message float-right' : 'my-message'}">${message.text}</div>
    </li>
  `);

  const updateAvatars = () => {
    jdenticon();
  };

  class ChatComponent {
    me = null;

    rooms = [];

    activeRoom = null;

    activeRoomMessages = [];

    openedRoomsState = {};

    isSearchMode = false;

    searchResults = [];

    domElements = {
      roomsList: null,
      roomHeader: null,
      messagesList: null,
      sendForm: null,
      sendFormTextInput: null,
      searchForm: null,
    };

    constructor(roomsList, roomHeader, messagesList, sendForm, searchForm) {
      this.domElements.roomsList = roomsList;
      this.domElements.roomHeader = roomHeader;
      this.domElements.messagesList = messagesList;
      this.domElements.sendForm = sendForm;
      this.domElements.sendFormTextInput = sendForm.querySelector('[name="text"]');
      this.domElements.searchForm = searchForm;
      this.domElements.searchFormTextInput = searchForm.querySelector('[name="query"]');
      this.init();
    }

    // --- ACTIONS ---

    async init() {
      this.addSendFormListeners();
      this.addSearchFormListeners();

      this.fetchMe();

      await this.fetchRooms();
      this.renderRooms();
    }

    async changeActiveRoom(roomId) {
      if (roomId === undefined || this.activeRoom?.id === roomId) {
        return;
      }
      this.rememberCurrentRoomState();
      await this.fetchActiveRoom(roomId);
      this.renderActiveRoom();
    }

    rememberCurrentRoomState() {
      if (this.activeRoom === null) {
        return;
      }
      this.openedRoomsState[this.activeRoom.id] = {
        sendForm: {
          text: this.domElements.sendFormTextInput.value,
        },
      };
    }

    createMessage() {
      if (this.activeRoom === null || this.domElements.sendFormTextInput.value.length === 0) {
        return;
      }
      const data = {
        roomId: this.activeRoom.id,
        text: this.domElements.sendFormTextInput.value,
      };
      fetchApi(`${appVariables.apiBaseUrl}/messages`, 'POST', data);
      this.domElements.sendFormTextInput.value = '';
    }

    scrollToEndOfMessageList() {
      this.domElements.messagesList.parentElement.scrollTo({
        top: this.domElements.messagesList.scrollHeight + 99999,
      });
    }

    doSearch() {
      if (this.domElements.searchFormTextInput.value.length < 2) {
        this.isSearchMode = false;
        this.renderRooms();
        return;
      }

      this.isSearchMode = true;

      const data = {
        query: this.domElements.searchFormTextInput.value,
      };
      fetchApi(`${appVariables.apiBaseUrl}/users`, 'GET', data)
        .then((resJSON) => {
          this.searchResults = resJSON.data;
          this.renderSearchResults();
        });
    }

    doSearchDebounced = debounce(this.doSearch, 500);

    async createRoom(userId) {
      const data = {
        userId,
      };
      const resJSON = await fetchApi(`${appVariables.apiBaseUrl}/rooms`, 'POST', data);
      await this.fetchRooms();
      this.changeActiveRoom(resJSON.data);
    }

    // --- HELPERS ---

    getUserOfMessage(message) {
      const user = this.activeRoom.users.find((u) => message.user === u.id);
      return user !== undefined ? user : this.me;
    }

    // --- FETCHES ---

    async fetchMe() {
      const resJSON = await fetchApi(`${appVariables.apiBaseUrl}/users/me`);
      this.me = resJSON.data;
    }

    async fetchRooms() {
      const resJSON = await fetchApi(`${appVariables.apiBaseUrl}/rooms`);
      this.rooms = resJSON.data;
    }

    async fetchActiveRoom(roomId) {
      const resJSON = await fetchApi(`${appVariables.apiBaseUrl}/rooms/${roomId}`);
      this.activeRoom = resJSON.data;
    }

    async fetchActiveRoomMessages(roomId) {
      const resJSON = await fetchApi(`${appVariables.apiBaseUrl}/messages/room/${roomId}`);
      this.activeRoomMessages = resJSON.data;
    }

    // --- LISTENERS ---

    roomsListItemOnClick = (e) => {
      const item = e.target;
      this.changeActiveRoom(item.dataset.roomId);
    };

    addRoomsListeners() {
      const roomsListItems = document.querySelectorAll('.chat-rooms-list-item');
      roomsListItems.forEach((roomsListItem) => {
        roomsListItem.addEventListener('click', this.roomsListItemOnClick);
      });
    }

    removeRoomsListeners() {
      const roomsListItems = document.querySelectorAll('.chat-rooms-list-item');
      roomsListItems.forEach((roomsListItem) => {
        roomsListItem.removeEventListener('click', this.roomsListItemOnClick);
      });
    }

    searchResultsListItemOnClick = (e) => {
      const item = e.target;
      this.createRoom(item.dataset.userId);
    };

    addSearchResultsListeners() {
      const roomsListItems = document.querySelectorAll('.chat-rooms-list-item');
      roomsListItems.forEach((roomsListItem) => {
        roomsListItem.addEventListener('click', this.searchResultsListItemOnClick);
      });
    }

    removeSearchResultsListeners() {
      const roomsListItems = document.querySelectorAll('.chat-rooms-list-item');
      roomsListItems.forEach((roomsListItem) => {
        roomsListItem.removeEventListener('click', this.roomsListItemOnClick);
      });
    }

    sendFormOnSubmit = (e) => {
      e.preventDefault();
      this.createMessage();
    };

    sendFormTextInputOnKeydown = (e) => {
      // CTRL + ENTER to submit a form
      if (!(e.keyCode === 13 && (e.metaKey || e.ctrlKey))) return;
      this.createMessage();
    };

    addSendFormListeners() {
      this.domElements.sendForm.addEventListener('submit', this.sendFormOnSubmit);
      this.domElements.sendFormTextInput.addEventListener('keydown', this.sendFormTextInputOnKeydown);
    }

    searchFormOnSubmit = (e) => {
      e.preventDefault();
      this.doSearchDebounced();
    };

    searchFormTextInputOnKeyup = () => {
      if (this.domElements.searchFormTextInput.value.length > 0) {
        this.doSearchDebounced();
      } else {
        this.doSearch();
      }
    };

    addSearchFormListeners() {
      this.domElements.searchForm.addEventListener('submit', this.searchFormOnSubmit);
      this.domElements.searchFormTextInput.addEventListener('keyup', this.searchFormTextInputOnKeyup);
    }

    // --- RENDERS ---

    async renderRooms() {
      let html = '';

      if (this.rooms.length > 0) {
        html = this.rooms.map(generateRoomListItemHTML).join('');
      } else {
        html = '<li>Your rooms list is empty.<br />Search for a friend and create one!</li>';
      }

      this.removeRoomsListeners();
      this.domElements.roomsList.innerHTML = html;
      this.addRoomsListeners();
      updateAvatars();
    }

    async renderSearchResults() {
      if (!this.isSearchMode) {
        return;
      }
      let html = '';

      if (this.searchResults.length > 0) {
        html = this.searchResults.map(generateSearchResultListItemHTML).join('');
      } else {
        html = '<li>No results for your input..</li>';
      }

      this.removeSearchResultsListeners();
      this.domElements.roomsList.innerHTML = html;
      this.addSearchResultsListeners();
      updateAvatars();
    }

    renderActiveRoom() {
      if (this.activeRoom === null) {
        // IDEA: render overlay?
        return;
      }
      this.renderActiveRoomHeader();
      this.renderActiveRoomMessages();
      this.renderActiveRoomSendForm();
    }

    renderActiveRoomHeader() {
      this.domElements.roomHeader.innerHTML = generateRoomHeaderHTML(this.activeRoom);
      updateAvatars();
    }

    async renderActiveRoomMessages() {
      let html = '';

      await this.fetchActiveRoomMessages(this.activeRoom.id);

      if (this.activeRoomMessages.length > 0) {
        html = this.activeRoomMessages
          .map((message) => {
            const user = this.getUserOfMessage(message);
            const isMeCreator = user.id === this.me.id;
            return generateMessageListItemHTML(message, user, isMeCreator);
          })
          .join('');
      } else {
        html = '<li class="text-center mt-4">No messages yet</li>';
      }

      this.domElements.messagesList.innerHTML = html;

      this.scrollToEndOfMessageList();
    }

    renderActiveRoomSendForm() {
      let textInputValue = '';
      if (this.openedRoomsState[this.activeRoom.id] !== undefined) {
        textInputValue = this.openedRoomsState[this.activeRoom.id].sendForm.text;
      }
      this.domElements.sendFormTextInput.value = textInputValue;
    }
  }

  window.ChatComponent = ChatComponent;
}
