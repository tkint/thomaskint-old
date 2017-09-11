import TagList from './tags';
import Config from './config';

// Getting fields from config files
const tagHtml = Config.tagHtml;
const tagLimits = Config.tagLimits;
const hiddenProps = Config.hiddenProps;
const tagList = TagList;

const EncoderPlugin = {
  install(Vue) {
    const isHiddenProperty = (prop) => {
      let i = 0;
      let hidden = false;
      while (i < hiddenProps.length && !hidden) {
        if (prop === hiddenProps[i]) {
          hidden = true;
        }
        i += 1;
      }
      return hidden;
    };
    // Functions to prepare tags
    const getOpenTag = (item) => {
      let props = '';
      if (item.props) {
        // For each specified property, add prop="value" to props
        Object.keys(item.props).forEach((key) => {
          if (item.props[key] && !isHiddenProperty(key)) {
            props += ` ${key}="${item.props[key]}"`;
          } else if (item.props[key] === '') {
            props += ` ${key}=""`;
          } else if (!item.props[key]) {
            props += ` ${key}`;
          }
        });
      }
      return `${tagLimits[0]}${item.tag}${props}${tagLimits[1]}`;
    };
    const getCloseTag = item => `${tagLimits[0]}/${item.tag}${tagLimits[1]}`;
    // Functions to prepare tags regexp
    const getOpenTagRegex = tag => `\\${tagLimits[0]}${tag}(.*?)\\${tagLimits[1]}`;
    const getCloseTagRegex = tag => `\\${tagLimits[0]}\\/${tag}\\${tagLimits[1]}`;
    /**
     * Encoder object
     * Contains methods and fields used in the page editor and page display
     * @type {{}}
     */
    const encoder = {};
    /**
     * Encoder tag list
     * Definition of tags in tags.js
     * @type {[*]}
     */
    encoder.tags = tagList;
    /**
     * Method which add specified tag around the selected text in a specified text input
     * @param inputId
     * @param tag
     * @returns {string}
     */
    encoder.addTag = (inputId, tag) => {
      // Get the input with the inputId
      const input = document.getElementById(inputId);
      // Get the selection start
      const start = input.selectionStart;
      // Get the selection end
      const end = input.selectionEnd;
      // Get the selected text
      const sel = input.value.substring(start, end);
      // Prepare the new text with the selected one rounded by tags
      const finText =
        input.value.substring(0, start) +
        getOpenTag(tag) +
        sel +
        getCloseTag(tag) +
        input.value.substring(end);
      // Get back the focus on the input
      input.focus();
      // TODO: Make this selection work
      // Select back the previously selected text (not working)
      input.setSelectionRange(start, end);
      return finText;
    };
    /**
     * Method which decode to HTML the text parsed with tags
     * @param text
     */
    encoder.decode = (text) => {
      // Replace bracket with HTML br tag
      let t = text.replace(/\n/g, '<br />');
      // For each tag in the tag list
      tagList.forEach((item) => {
        // If the tag have a specified HTML tag, then we take it.
        // We'll take the default one otherwise
        const html = (item.html) ? item.html : tagHtml;
        // Prepare properties of the html tag
        let props = '';
        if (item.props) {
          // For each specified property, add prop="value" to props
          Object.keys(item.props).forEach((key) => {
            if (item.props[key]) {
              props += ` ${key}="${item.props[key]}"`;
            }
          });
        }
        // Prepare the replacement string with HTML tag and properties
        const replace = `<${html}${props} $1>$2</${html}>`;
        // Prepare regexp with full tags around text
        const regex = new RegExp(`${getOpenTagRegex(item.tag)}(.*?)${getCloseTagRegex(item.tag)}`, 'ig');
        // Repace text found with regexp with replacement string
        t = t.replace(regex, replace);
      });
      return t;
    };
    // Adding the Encoder object in Vue
    Vue.prototype.$encoder = encoder;
  },
};

export default EncoderPlugin;
