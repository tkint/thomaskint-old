import VueMediumEditor from 'vue2-medium-editor';

export default VueMediumEditor.MediumEditor.extensions.anchor.extend({
  name: 'title',
  contentDefault: '<b>T</b>',
  placeholderText: 'Title',
});
