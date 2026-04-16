import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

export default function RedisStreamsBlog() {
  const markdownPath = path.join(process.cwd(), 'app/blog/redis-streams/content.md');
  const markdownContent = fs.readFileSync(markdownPath, 'utf-8');

  return (
    <div className="md:pl-64 pt-16 min-h-screen bg-[#0e0e0e]">
      <main className="p-4 sm:p-8">
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-[#DC382D]/10 text-[#DC382D] text-xs font-bold font-inter px-3 py-1 rounded-sm tracking-widest uppercase">
                Redis
              </span>
              <span className="bg-[#6DB33F]/10 text-[#6DB33F] text-xs font-bold font-inter px-3 py-1 rounded-sm tracking-widest uppercase">
                Spring Boot
              </span>
              <span className="text-[#adaaaa] font-manrope text-sm">
                April 16, 2026
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-space-grotesk tracking-tighter text-white mb-4 uppercase">
              Redis Streams Production Pattern
            </h1>
            <p className="text-[#adaaaa] font-manrope text-base sm:text-lg">
              Battle-tested implementation with consumer scaling, retry logic, dead-letter queues, and latency tracking using Spring Boot.
            </p>
          </div>

          {/* Content */}
          <div className="bg-[#1a1a1a] p-6 sm:p-8 rounded-sm">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-2xl sm:text-3xl font-black font-space-grotesk tracking-tighter text-white mb-4 mt-8 uppercase" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-xl sm:text-2xl font-bold font-space-grotesk text-white mb-3 mt-6 uppercase" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-lg sm:text-xl font-bold font-space-grotesk text-[#ff8aa7] mb-2 mt-4" {...props} />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4 className="text-base sm:text-lg font-bold font-space-grotesk text-[#81ecff] mb-2 mt-3" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-[#adaaaa] font-manrope text-sm sm:text-base leading-relaxed mb-4" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-inside text-[#adaaaa] font-manrope text-sm sm:text-base mb-4 space-y-2 ml-4" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-inside text-[#adaaaa] font-manrope text-sm sm:text-base mb-4 space-y-2 ml-4" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="ml-2" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="text-[#ff8aa7] font-bold" {...props} />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full border border-white/10" {...props} />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead className="bg-[#0e0e0e]" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th className="border border-white/10 px-4 py-2 text-left text-[#ff8aa7] font-bold" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="border border-white/10 px-4 py-2 text-[#adaaaa]" {...props} />
                  ),
                  code: ({ node, inline, className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="my-4 rounded-sm overflow-hidden">
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            padding: '1.5rem',
                            background: '#0e0e0e',
                            fontSize: '0.875rem',
                            lineHeight: '1.5',
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-[#0e0e0e] text-[#81ecff] px-2 py-1 rounded-sm text-xs font-mono" {...props}>
                        {children}
                      </code>
                    );
                  },
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-2 border-[#ff8aa7] pl-4 my-4 text-[#adaaaa] italic" {...props} />
                  ),
                  hr: ({ node, ...props }) => (
                    <hr className="border-white/5 my-8" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a className="text-[#81ecff] hover:text-[#ff8aa7] transition-colors underline" {...props} />
                  ),
                }}
              >
                {markdownContent}
              </ReactMarkdown>
            </div>
          </div>

          {/* Back to Home CTA */}
          <div className="mt-8 bg-[#1a1a1a] p-6 sm:p-8 rounded-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#ff8aa7]/10 to-transparent"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black font-space-grotesk tracking-tighter mb-2 uppercase text-white">
                  More Interview Questions
                </h3>
                <p className="text-[#adaaaa] font-manrope text-sm sm:text-base">
                  Practice Redis, Spring Boot, and other topics.
                </p>
              </div>
              <a
                href="/"
                className="px-6 sm:px-8 py-3 bg-[#ff8aa7] text-black font-bold font-space-grotesk uppercase tracking-widest text-sm rounded-sm hover:translate-y-[-2px] transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,138,167,0.2)]"
              >
                Back to Questions
              </a>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
