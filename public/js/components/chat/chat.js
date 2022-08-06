/* global debounce appVariables fetchApi ChatHtmlGenerators updateAvatars socket */

{
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

      this.addSocketEventsListeners();

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

    processNewMessage(message) {
      const roomIndex = this.rooms.findIndex((r) => r.id === message.room);
      if (roomIndex !== -1) {
        const room = this.rooms[roomIndex];
        this.rooms.splice(roomIndex, 1);
        this.rooms.splice(0, 0, {
          ...room,
          lastMessage: message,
        });
        this.renderRooms();
      }
      if (this.activeRoom !== null && message.room === this.activeRoom.id) {
        this.activeRoomMessages.push(message);
        this.renderActiveRoomMessages();
      }
    }

    processNewRoom(room) {
      this.rooms.splice(0, 0, room);
      this.renderRooms();
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

    addSocketEventsListeners() {
      if (socket === undefined) {
        console.error('socket.io not initialized.');
        return;
      }

      socket.on('message:create', (message) => {
        this.processNewMessage(message);
      });
      socket.on('room:create', (room) => {
        this.processNewRoom(room);
      });
    }

    // --- RENDERS ---

    renderRooms() {
      let html = '';

      if (this.rooms.length > 0) {
        html = this.rooms.map(ChatHtmlGenerators.roomListItemHTML).join('');
      } else {
        html = '<li>Your rooms list is empty.<br />Search for a friend and create one!</li>';
      }

      this.removeRoomsListeners();
      this.domElements.roomsList.innerHTML = html;
      this.addRoomsListeners();
      updateAvatars();
    }

    renderSearchResults() {
      if (!this.isSearchMode) {
        return;
      }
      let html = '';

      if (this.searchResults.length > 0) {
        html = this.searchResults.map(ChatHtmlGenerators.searchResultListItemHTML).join('');
      } else {
        html = '<li>No results for your input..</li>';
      }

      this.removeSearchResultsListeners();
      this.domElements.roomsList.innerHTML = html;
      this.addSearchResultsListeners();
      updateAvatars();
    }

    async renderActiveRoom() {
      if (this.activeRoom === null) {
        // IDEA: render overlay?
        return;
      }
      this.renderActiveRoomHeader();
      this.renderActiveRoomSendForm();

      await this.fetchActiveRoomMessages(this.activeRoom.id);
      this.renderActiveRoomMessages();
    }

    renderActiveRoomHeader() {
      this.domElements.roomHeader.innerHTML = ChatHtmlGenerators.roomHeaderHTML(this.activeRoom);
      updateAvatars();
    }

    renderActiveRoomMessages() {
      let html = '';

      if (this.activeRoomMessages.length > 0) {
        html = this.activeRoomMessages
          .map((message) => {
            const user = this.getUserOfMessage(message);
            const isMeCreator = user.id === this.me.id;
            return ChatHtmlGenerators.messageListItemHTML(message, user, isMeCreator);
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
