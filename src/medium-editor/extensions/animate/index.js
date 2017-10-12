import VueMediumEditor from 'vue2-medium-editor';
import Config from './config';

export default VueMediumEditor.MediumEditor.extensions.anchor.extend({
  name: 'animate',
  aria: 'animate',
  action: null,
  tagNames: ['span'],
  contentDefault: '<b>A</b>',
  placeholderText: Config.placeholderText,
  repeatCheckbox: Config.repeatCheckbox,
  repeatCheckboxText: Config.repeatCheckboxText,
  classToApply: Config.classToApply,
  animations: Config.animations,
  handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const range = VueMediumEditor.MediumEditor.selection.getSelectionRange(this.document);

    if (range.startContainer.nodeName.toLowerCase() === 'span' ||
      range.endContainer.nodeName.toLowerCase() === 'span' ||
      VueMediumEditor.MediumEditor.util.getClosestTag(VueMediumEditor.MediumEditor.selection.getSelectedParentElement(range), 'span')) {
      return this.deleteAnimation();
    }

    if (!this.isDisplayed()) {
      this.showForm();
    }

    return false;
  },
  getTemplate() {
    const template = [
      '<select class="medium-editor-toolbar-input">',
    ];

    this.animations.forEach((anim) => {
      template.push(`<option value="${anim}">${anim}</option>`);
    });

    template.push(
      '</select>',
      '<a href="#" class="medium-editor-toolbar-save">',
      this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-check"></i>' : this.formSaveLabel,
      '</a>',
      '<a href="#" class="medium-editor-toolbar-close">',
      this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-times"></i>' : this.formCloseLabel,
      '</a>',
    );

    if (this.repeatCheckbox) {
      template.push(
        '<div class="medium-editor-toolbar-form-row">',
        `<input type="checkbox" class="medium-editor-toolbar-animate-repeat" id="medium-editor-toolbar-anchor-animate-repeat-${this.getEditorId()}">`,
        `<label for="medium-editor-toolbar-animate-repeat-field-${this.getEditorId()}">`,
        this.repeatCheckboxText,
        '</label>',
        '</div>',
        );
    }

    return template.join('');
  },
  showForm(opts) {
    let o = opts;
    const input = this.getInput();
    const repeatCheckbox = this.getAnimateRepeatCheckbox();

    o = o || { value: this.animations[0] };
    if (typeof o === 'string') {
      o = {
        value: o,
      };
    }

    this.base.saveSelection();
    this.hideToolbarDefaultActions();
    VueMediumEditor.MediumEditor.extensions.form.prototype.showForm.apply(this);
    this.setToolbarPosition();

    input.value = o.value;
    input.focus();

    if (repeatCheckbox) {
      repeatCheckbox.checked = o.repeat;
    }
  },
  getFormOpts() {
    const opts = {
      value: this.getInput().value.trim(),
      repeat: this.getAnimateRepeatCheckbox().checked,
    };
    return opts;
  },
  completeFormSave(opts) {
    this.base.restoreSelection();
    this.createAnimation(opts);
    this.base.checkSelection();
  },
  createForm() {
    const doc = this.document;
    const form = doc.createElement('div');

    form.className = 'medium-editor-toolbar-form';
    form.id = `medium-editor-toolbar-form-animate-${this.getEditorId()}`;
    form.innerHTML = this.getTemplate();
    this.attachFormEvents(form);

    return form;
  },
  getInput() {
    return this.getForm().querySelector('select.medium-editor-toolbar-input');
  },
  getAnimateRepeatCheckbox() {
    return this.getForm().querySelector('.medium-editor-toolbar-animate-repeat');
  },
  createAnimation(opts) {
    const range = VueMediumEditor.MediumEditor.selection.getSelectionRange(this.document);
    const span = document.createElement('span');
    span.className = this.classToApply;
    span.setAttribute(opts.value, '');
    if (opts.repeat) {
      span.setAttribute('repeat', '');
    }
    span.appendChild(document.createTextNode(document.getSelection()));
    range.deleteContents();
    range.insertNode(span);
    const newRange = document.createRange();
    newRange.setStartAfter(span);
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(newRange);
    document.execCommand('insertHTML', false, '');
  },
  deleteAnimation() {
    this.base.restoreSelection();
    const range = VueMediumEditor.MediumEditor.selection.getSelectionRange(this.document);
    const span = VueMediumEditor.MediumEditor.util.getClosestTag(VueMediumEditor.MediumEditor.selection.getSelectedParentElement(range), 'span');
    const parent = span.parentNode;
    const children = span.childNodes;
    parent.removeChild(span);
    children.forEach(node => range.insertNode(node));
    document.execCommand('insertHTML', false, '');
    this.base.selectElement(parent.firstChild);
    this.base.checkSelection();
  },
});
