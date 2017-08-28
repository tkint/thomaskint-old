const Encoder = {};

export default Encoder.install = function (Vue, options) {
  const vue = Vue;
  if (options) {
    console.log(options);
  }
  vue.encode = function () {
    console.log('Hey!');
    return 'Hello World!';
  };
  vue.prototype.$encoder = this;
};
