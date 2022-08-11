class SocketRouter {
  events = {};

  init(socket) {
    const eventNames = Object.keys(this.events);
    eventNames.forEach((eventName) => {
      socket.on(eventName, this.events[eventName](socket));
    });
  }

  add(eventName, listener) {
    const listenerFinal = (socket) => (...args) => listener(socket, ...args);
    this.events[eventName] = listenerFinal;
  }
}

module.exports = SocketRouter;
