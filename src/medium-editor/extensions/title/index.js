import VueMediumEditor from 'vue2-medium-editor';
import Config from './config';

export default VueMediumEditor.MediumEditor.extensions.anchor.extend({
  name: 'title',
  aria: 'title',
  action: null,
  tagNames: ['span'],
  contentDefault: '<b>T</b>',
  classToApply: Config.classToApply,
  horizontalValues: ['left', 'center', 'right'],
  verticalValues: ['top', 'middle', 'bottom'],
  handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const range = VueMediumEditor.MediumEditor.selection.getSelectionRange(this.document);

    if (range.startContainer.nodeName.toLowerCase() === 'span' ||
      range.endContainer.nodeName.toLowerCase() === 'span' ||
      VueMediumEditor.MediumEditor.util.getClosestTag(VueMediumEditor.MediumEditor.selection.getSelectedParentElement(range), 'span')) {
      return this.deleteTitle();
    }

    if (!this.isDisplayed()) {
      this.showForm();
    }

    return false;
  },
  getTemplate() {
    const template = [
      '<div class="medium-editor-toolbar-form-row">',
      '<table border="1">',
    ];

    let i = 0;
    let j = 0;

    while (i < this.verticalValues.length) {
      template.push('<tr style="height: 10px;">');
      while (j < this.horizontalValues.length) {
        const cellClass = `medium-editor-toolbar-choose-${this.horizontalValues[j]}-${this.verticalValues[i]}`;
        template.push(
          `<td class="${cellClass}" style="width: 10px; height: 10px; cursor:pointer;">`,
          '</td>',
        );
        j += 1;
      }
      template.push('</tr>');
      i += 1;
      j = 0;
    }

    template.push(
      '</table>',
      '<input class="horizontal-choice" style="visibility: hidden; position: absolute;">',
      '<input class="vertical-choice" style="visibility: hidden; position: absolute;">',
      '</div>',
      '<a href="#" class="medium-editor-toolbar-save">',
      this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-check"></i>' : this.formSaveLabel,
      '</a>',
      '<a href="#" class="medium-editor-toolbar-close">',
      this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-times"></i>' : this.formCloseLabel,
      '</a>',
    );

    return template.join('');
  },
  showForm(opts) {
    let o = opts;
    const horizontalChoice = this.getHorizontalChoice();
    const verticalChoice = this.getVerticalChoice();

    o = o || { x: 'middle', y: 'top' };
    // if (typeof o === 'string') {
    //   o = {
    //     x: o,
    //   };
    // }

    this.base.saveSelection();
    this.hideToolbarDefaultActions();
    VueMediumEditor.MediumEditor.extensions.form.prototype.showForm.apply(this);
    this.setToolbarPosition();

    horizontalChoice.value = o.x;
    verticalChoice.value = o.y;
  },
  getFormOpts() {
    const opts = {
      x: this.getHorizontalChoice().value.trim(),
      y: this.getVerticalChoice().value.trim(),
    };
    return opts;
  },
  completeFormSave(opts) {
    this.base.restoreSelection();
    this.createTitle(opts);
    this.base.checkSelection();
  },
  createForm() {
    const doc = this.document;
    const form = doc.createElement('div');

    form.className = 'medium-editor-toolbar-form';
    form.id = `medium-editor-toolbar-form-title-${this.getEditorId()}`;
    form.innerHTML = this.getTemplate();
    this.attachFormEvents(form);

    return form;
  },
  attachFormEvents(form) {
    const close = form.querySelector('.medium-editor-toolbar-close');
    const save = form.querySelector('.medium-editor-toolbar-save');

    // Handle clicks on the form itself
    this.on(form, 'click', this.handleFormClick.bind(this));

    // Handle close button clicks
    this.on(close, 'click', this.handleCloseClick.bind(this));

    // Handle save button clicks (capture)
    this.on(save, 'click', this.handleSaveClick.bind(this), true);

    let i = 0;
    let j = 0;

    while (i < this.verticalValues.length) {
      while (j < this.horizontalValues.length) {
        const cellClass = `.medium-editor-toolbar-choose-${this.horizontalValues[j]}-${this.verticalValues[i]}`;
        const cell = form.querySelector(cellClass);
        this.on(cell, 'click', this.handleCellClick.bind(this, cell), true);
        j += 1;
      }
      i += 1;
      j = 0;
    }
  },
  handleCellClick(cell) {
    this.doCellChoose(cell);
  },
  doCellChoose(cell) {
    const cellClass = cell.className;
    const horizontalValue = cellClass.split('-')[4];
    const verticalValue = cellClass.split('-')[5];
    this.getHorizontalChoice().value = horizontalValue;
    this.getVerticalChoice().value = verticalValue;
  },
  getHorizontalChoice() {
    return this.getForm().querySelector('.horizontal-choice');
  },
  getVerticalChoice() {
    return this.getForm().querySelector('.vertical-choice');
  },
  createTitle(opts) {
    const range = VueMediumEditor.MediumEditor.selection.getSelectionRange(this.document);
    const span = document.createElement('span');
    span.className = this.classToApply;
    span.setAttribute(opts.x, '');
    span.setAttribute(opts.y, '');
    span.appendChild(document.createTextNode(document.getSelection()));
    range.deleteContents();
    range.insertNode(span);
    const newRange = document.createRange();
    newRange.setStartAfter(span);
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(newRange);
    document.execCommand('insertHTML', false, '');
  },
  deleteTitle() {
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
