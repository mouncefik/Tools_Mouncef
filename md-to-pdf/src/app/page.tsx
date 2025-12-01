'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import styles from './page.module.css';

const defaultMarkdown = `# Markdown to PDF Converter

<style>
  h1 { color: #0066cc; }
  .custom-box {
    border: 2px solid #0066cc;
    padding: 10px;
    border-radius: 5px;
    background: #e6f2ff;
  }
</style>

Welcome to the Markdown to PDF Converter! Type your markdown in the editor below and see the preview on the right.

## Features

- **Live Preview**: See your markdown rendered in real-time
- **Print to PDF**: Press \`Ctrl+P\` or use the download button to save as PDF
- **HTML & CSS Support**: Use HTML tags and CSS directly in your markdown!

## Example Content

<div class="custom-box">
  This is a custom HTML div styled with CSS defined above!
</div>

### Lists
- Item 1
- Item 2
  - Nested item
  - Another nested item

### Code Block
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Table
| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
| Data 3   | Data 4   |

---

**Press Ctrl+P to download as PDF!**
`;

export default function Home() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [frameWidth, setFrameWidth] = useState<'a4' | 'letter' | 'full'>('a4');
  const [editorWidth, setEditorWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const container = e.currentTarget as HTMLElement;
    const containerRect = container.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    // Constrain between 20% and 80%
    if (newWidth >= 20 && newWidth <= 80) {
      setEditorWidth(newWidth);
    }
  };

  const components: Components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      return !inline && language ? (
        <div className={styles.codeBlockWrapper}>
          <div className={styles.codeBlockHeader}>
            <span className={styles.languageLabel}>{language}</span>
          </div>
          <pre className={styles.codeBlock}>
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>.MD-MOUNCEF</h1>
        <div className={styles.headerControls}>
          <div className={styles.frameControls}>
            <span className={styles.controlLabel}>Frame Size:</span>
            <button
              onClick={() => setFrameWidth('a4')}
              className={`${styles.frameButton} ${frameWidth === 'a4' ? styles.active : ''}`}
            >
              A4
            </button>
            <button
              onClick={() => setFrameWidth('letter')}
              className={`${styles.frameButton} ${frameWidth === 'letter' ? styles.active : ''}`}
            >
              Letter
            </button>
            <button
              onClick={() => setFrameWidth('full')}
              className={`${styles.frameButton} ${frameWidth === 'full' ? styles.active : ''}`}
            >
              Full Width
            </button>
          </div>
          <button onClick={handlePrint} className={styles.printButton}>
            Download PDF (Ctrl+P)
          </button>
        </div>
      </header>

      <main
        className={styles.main}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          gridTemplateColumns: `${editorWidth}% 4px ${100 - editorWidth}%`
        }}
      >
        <div className={styles.editor}>
          <h2>Markdown Editor</h2>
          <textarea
            className={styles.textarea}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Type your markdown here..."
            spellCheck={false}
          />
        </div>

        {/* Draggable Divider */}
        <div
          className={styles.resizer}
          onMouseDown={handleMouseDown}
        ></div>

        <div className={`${styles.preview} ${styles[`frame-${frameWidth}`]}`} id="print-content">
          <h2 className={styles.previewTitle}>Preview</h2>
          <div className={styles.markdownContent}>
            <ReactMarkdown
              components={components}
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      </main>
    </div>
  );
}
