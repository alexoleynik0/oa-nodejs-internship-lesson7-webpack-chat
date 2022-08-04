const appNotification = {
  statusToColor: {
    success: '#a5dc86',
    error: '#f27474',
    warning: '#f8bb86',
    info: '#3fc3ee',
    question: '#87adbd',
  },
  show(status, title, html, options = {}) {
    if (typeof Swal === 'undefined') {
      alert(`${title}${html ? `\n${html}` : ''}`);
      return;
    }
    Swal.fire({
      // default for a notification
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
      toast: true,
      background: '#f2f4f6',
      // passed
      color: this.statusToColor[status] || this.statusToColor.info,
      title,
      html,
      ...options,
    });
  },
  success(...args) {
    this.show('success', ...args);
  },
  error(...args) {
    this.show('error', ...args);
  },
  warning(...args) {
    this.show('warning', ...args);
  },
  info(...args) {
    this.show('info', ...args);
  },
  question(...args) {
    this.show('question', ...args);
  },
};
