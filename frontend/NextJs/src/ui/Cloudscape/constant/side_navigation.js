export const HEADER = { href: '#/', text: 'Service name' };

export const ITEMS = [
  { type: 'link', text: 'Page 1', href: '#/page1' },
  { type: 'link', text: 'Page 2', href: '#/page2' },
  {
    type: 'section',
    text: 'Section 1',
    items: [
      {
        type: 'link',
        text: 'Page 4',
        href: '#/page4',
      },
      {
        type: 'link',
        text: 'Page 5',
        href: '#/page5',
      },
      {
        type: 'link',
        text: 'Page 6',
        href: '#/page6',
      },
    ],
  },
  {
    type: 'section',
    text: 'Section 2',
    items: [
      {
        type: 'link',
        text: 'Page 7',
        href: '#/page7',
      },
      {
        type: 'link',
        text: 'Page 8',
        href: '#/page8',
      },
      {
        type: 'link',
        text: 'Page 9',
        href: '#/page9',
      },
    ],
  },
];
