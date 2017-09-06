const EncoderPlugin = {
  install(Vue) {
    const encoder = {};
    encoder.addTag = (inputId, tag) => {
      const input = document.getElementById(inputId);
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const sel = input.value.substring(start, end);
      const finText = `${input.value.substring(0, start)}<${tag}>${sel}</${tag}>${input.value.substring(end)}`;
      this.page.content = finText;
      input.focus();
      input.setSelectionRange(start, end);
    };
    encoder.decode = (text) => {
      if (text && text === 'hello') {
        return 'Hello World !';
      }
      return 'Bye Byyyye';
    };
    Vue.prototype.$encoder = encoder;
  },
};

export default EncoderPlugin;
