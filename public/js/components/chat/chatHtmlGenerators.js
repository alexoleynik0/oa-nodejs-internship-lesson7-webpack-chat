/* global timestampToHuman */

{
  class ChatHtmlGenerators {
    static userAvatarHTML(user, size) {
      return `
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
`;
    }

    static roomListItemHTML(room) {
      console.log(room.users[0]?.nickname, room.isActiveRoom);
      return `
<li class="clearfix chat-rooms-list-item ${room.isActiveRoom ? 'active' : ''}" data-room-id="${room.id}">
  ${ChatHtmlGenerators.userAvatarHTML(room.users[0] || room.creator, 55)}
  ${room.users.length > 0 ? `<div class="status ${room.roomOnline ? 'online' : ''}"></div>` : ''}
  <div class="about">
    <div class="name">${room.users[0]?.nickname || 'My notes'}</div>
    <div class="last-message">${room.lastMessage !== undefined ? room.lastMessage.text : '[no messages yet]'}</div>
  </div>
</li>
`;
    }

    static searchResultListItemHTML(user) {
      return `
<li class="clearfix chat-rooms-list-item" data-user-id="${user.id}">
  ${ChatHtmlGenerators.userAvatarHTML(user, 55)}
  <div class="status ${user.online ? 'online' : ''}"></div>
  <div class="about">
    <div class="name">${user.nickname}</div>
    <div class="last-message">[click to create a Room]</div>
  </div>
</li>
`;
    }

    static roomHeaderHTML(room) {
      let infoText = room.messagesCount > 0 ? `already ${(room.messagesCount).toLocaleString(undefined)} messages` : '[no messages yet]';
      let infoClasses = '';
      if (
        !room.roomOnline
        && room.users.length === 1
        && room.users[0].lastActivityAt !== undefined
      ) {
        infoText = `last active at ${timestampToHuman(room.users[0].lastActivityAt)}`;
        infoClasses = 'last-activity-at';
      }
      if (room.somebodyTyping !== null) {
        infoText = `${room.somebodyTyping.nickname} is typing...`;
        infoClasses = 'somebody-typing';
      }
      return `
${ChatHtmlGenerators.userAvatarHTML(room.users[0] || room.creator, 55)}
<div class="status ${room.roomOnline ? 'online' : ''}"></div>
<div class="chat-about">
  <div class="chat-with">${room.users[0] !== undefined ? `Room with ${room.users[0].nickname}` : 'My notes'}</div>
  <div class="chat-info ${infoClasses}">${infoText}</div>
</div>
`;
    }

    static messageListItemHTML(message, user, isMeCreator) {
      const timeHtml = `<span class="message-data-time">${timestampToHuman(message.createdAt)}</span>`;
      const nameHtml = `<span class="message-data-name">${user.nickname}</span>`;
      return `
<li class="clearfix chat-room-messages-list-item" data-message-id="${message.id}">
  <div class="message-data ${isMeCreator ? 'text-right' : ''}">
    ${isMeCreator ? timeHtml + nameHtml : nameHtml + timeHtml}
  </div>
  <div class="message ${isMeCreator ? 'other-message float-right' : 'my-message'}">${message.text}</div>
</li>
`;
    }
  }

  window.ChatHtmlGenerators = ChatHtmlGenerators;
}
