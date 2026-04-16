import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function SpringEventPublisherBlog() {
  const markdownPath = path.join(process.cwd(), 'app/blog/spring-event-publisher/content.md');
  const markdownContent = fs.readFileSync(markdownPath, 'utf-8');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <ReactMarkdown
          className="prose prose-lg max-w-none"
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-gray-100 px-2 py-1 rounded text-sm" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </article>
    </div>
  );
}
