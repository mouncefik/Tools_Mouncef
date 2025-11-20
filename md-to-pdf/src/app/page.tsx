'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import styles from './page.module.css';

const defaultMarkdown = `# Markdown to PDF Converter

Welcome to the Markdown to PDF Converter! Type your markdown in the editor below and see the preview on the right.

## Features

- **Live Preview**: See your markdown rendered in real-time
- **Print to PDF**: Press \`Ctrl+P\` or use the download button to save as PDF
- **Clean Design**: Beautiful, print-friendly styling

## Example Content

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

  const handlePrint = () => {
    window.print();
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
        <button onClick={handlePrint} className={styles.printButton}>
          Download PDF (Ctrl+P)
        </button>
      </header>

      <main className={styles.main}>
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

        <div className={styles.preview} id="print-content">
          <h2 className={styles.previewTitle}>Preview</h2>
          <div className={styles.markdownContent}>
            <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
          </div>
        </div>
      </main>
    </div>
  );
}
