import VueMediumEditor from 'vue2-medium-editor';
import Animate from './extensions/animate';

console.log(VueMediumEditor.MediumEditor.prototype.defaults.extensions);

VueMediumEditor.MediumEditor.prototype.defaults.extensions.animate = new Animate();

VueMediumEditor.MediumEditor.extensions.toolbar.prototype.defaults = [
  'bold',
  'italic',
  'underline',
  'anchor',
  'h2',
  'h3',
  'quote',
  'justifyCenter',
];

export default VueMediumEditor;
