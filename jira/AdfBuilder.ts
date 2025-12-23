/**
 * Builder for Jira rich text documents.
 */

import type { AdfContent, AdfDocument } from './types';

export class TextBuilder {
  private readonly content: AdfContent[] = [];

  bold(text: string): this {
    this.content.push({ marks: [{ type: 'strong' }], text, type: 'text' });
    return this;
  }

  italic(text: string): this {
    this.content.push({ marks: [{ type: 'em' }], text, type: 'text' });
    return this;
  }

  link(text: string, href: string): this {
    this.content.push({ marks: [{ attrs: { href }, type: 'link' }], text, type: 'text' });
    return this;
  }

  text(value: string): this {
    this.content.push({ text: value, type: 'text' });
    return this;
  }

  build(): AdfContent[] {
    return this.content;
  }
}

export class BulletListBuilder {
  private readonly items: AdfContent[] = [];

  item(label: string, value: string): this {
    this.items.push({
      content: [
        {
          content: [
            { marks: [{ type: 'strong' }], text: `${label}: `, type: 'text' },
            { text: value || 'N/A', type: 'text' },
          ],
          type: 'paragraph',
        },
      ],
      type: 'listItem',
    });
    return this;
  }

  itemWithLink(label: string, linkText: string, url: string): this {
    this.items.push({
      content: [
        {
          content: [
            { marks: [{ type: 'strong' }], text: `${label}: `, type: 'text' },
            { marks: [{ attrs: { href: url }, type: 'link' }], text: linkText, type: 'text' },
          ],
          type: 'paragraph',
        },
      ],
      type: 'listItem',
    });
    return this;
  }

  plainItem(text: string): this {
    this.items.push({
      content: [{ content: [{ text, type: 'text' }], type: 'paragraph' }],
      type: 'listItem',
    });
    return this;
  }

  build(): AdfContent {
    return { content: this.items, type: 'bulletList' };
  }
}

export class AdfBuilder {
  private readonly content: AdfContent[] = [];

  codeBlock(text: string, language: string = 'text'): this {
    this.content.push({
      attrs: { language },
      content: [{ text, type: 'text' }],
      type: 'codeBlock',
    });
    return this;
  }

  expand(title: string, builder: (b: AdfBuilder) => void): this {
    const inner = new AdfBuilder();
    builder(inner);
    this.content.push({ attrs: { title }, content: inner.getContent(), type: 'expand' });
    return this;
  }

  heading(level: 1 | 2 | 3 | 4 | 5 | 6, text: string): this {
    this.content.push({ attrs: { level }, content: [{ text, type: 'text' }], type: 'heading' });
    return this;
  }

  bulletList(builder: (b: BulletListBuilder) => void): this {
    const list = new BulletListBuilder();
    builder(list);
    this.content.push(list.build());
    return this;
  }

  paragraph(arg: string | ((b: TextBuilder) => void)): this {
    if (typeof arg === 'string') {
      this.content.push({ content: [{ text: arg, type: 'text' }], type: 'paragraph' });
    } else {
      const text = new TextBuilder();
      arg(text);
      this.content.push({ content: text.build(), type: 'paragraph' });
    }
    return this;
  }

  rule(): this {
    this.content.push({ type: 'rule' });
    return this;
  }

  getContent(): AdfContent[] {
    return this.content;
  }

  build(): AdfDocument {
    return { content: this.content, type: 'doc', version: 1 };
  }
}
