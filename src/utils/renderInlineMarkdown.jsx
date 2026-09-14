import { createElement } from 'react';

export const renderInlineMarkdown = (text) => text
  .split(/(\*\*[^*]+\*\*)/g)
  .map((part, index) => (
    part.startsWith('**') && part.endsWith('**')
      ? createElement('strong', { key: index }, part.slice(2, -2))
      : part
  ));
