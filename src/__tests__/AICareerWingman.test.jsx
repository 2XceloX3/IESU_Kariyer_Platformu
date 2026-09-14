import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderInlineMarkdown } from '../utils/renderInlineMarkdown';

describe('AICareerWingman message rendering', () => {
  it('renders supported bold syntax without interpreting response text as HTML', () => {
    const { container } = render(
      <div>{renderInlineMarkdown('**Güvenli başlık** <img src=x onerror=alert(1)>')}</div>
    );

    expect(container.querySelector('strong')).toHaveTextContent('Güvenli başlık');
    expect(container.querySelector('img')).toBeNull();
    expect(container).toHaveTextContent('<img src=x onerror=alert(1)>');
  });
});
