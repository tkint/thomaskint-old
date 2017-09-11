/**
 * List of tags constructed like that:
 * tag: Specify the custom tag text
 * html: Optional, specify the html tag when it comes to decode
 * props: Optional, specify the html properties when it comes to decode
 * {
 *  prop0: value0,
 *  prop1: value1,
 * }
 * btn:
 * {
 *  text: Optional, specify the text in the button if no icon and different from tag
 *  size: Optional, specify the size of the text inside the button
 *  color: Optional, specify the color of the button
 *  icon:
 *    {
 *      text: Optional, specify the Material Icon to use
 *      fa: Optional, specify if the icon is one from Font Awesome
 *    }
 * }
 */
import Config from './config';

let tagList = [];

tagList = tagList.concat([
  {
    tag: 'i',
    html: 'i',
    btn: {
      icon: {
        text: 'format_italic',
        fa: false,
      },
    },
  },
  {
    tag: 'b',
    html: 'b',
    btn: {
      icon: {
        text: 'format_bold',
        fa: false,
      },
    },
  },
  {
    tag: 'u',
    html: 'u',
    btn: {
      icon: {
        text: 'format_underlined',
        fa: false,
      },
    },
  },
  {
    tag: 'left',
    props: {
      class: 'tk-align-left',
    },
    btn: {
      icon: {
        text: 'format_align_left',
        fa: false,
      },
    },
  },
  {
    tag: 'center',
    props: {
      class: 'tk-align-center',
    },
    btn: {
      icon: {
        text: 'format_align_center',
        fa: false,
      },
    },
  },
  {
    tag: 'right',
    props: {
      class: 'tk-align-right',
    },
    btn: {
      icon: {
        text: 'format_align_right',
        fa: false,
      },
    },
  },
  {
    tag: 'justify',
    props: {
      class: 'tk-align-justify',
    },
    btn: {
      icon: {
        text: 'format_align_justify',
        fa: false,
      },
    },
  },
  {
    tag: 'title',
    props: {
      class: 'tk-title',
    },
  },
  {
    tag: 'animate',
    props: {
      class: 'tk-animate',
    },
  },
  {
    tag: 'link',
    html: 'a',
    props: {
      href: null,
    },
    btn: {
      icon: {
        text: 'link',
        fa: false,
      },
    },
  },
]);

for (let i = 1; i < 7; i += 1) {
  tagList.push(
    {
      tag: `title-${i}`,
      html: `h${i}`,
    },
  );
}

for (let i = 0; i < Config.colors.length; i += 1) {
  tagList.push(
    {
      tag: 'color',
      props: {
        code: `#${Config.colors[i]}`,
        style: `color: #${Config.colors[i]}`,
      },
      btn: {
        text: `#${Config.colors[i]}`,
        color: `#${Config.colors[i]}`,
      },
    },
  );
}

const tags = tagList;

export default tags;
