import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Image from "next/image";

const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: (props) => (
          <h1
            className="text-3xl font-bold mb-6 text-primary dark:text-primary-light"
            {...props}
          />
        ),
        h2: (props) => (
          <h2
            className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-primary-light"
            {...props}
          />
        ),
        h3: (props) => (
          <h3
            className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white"
            {...props}
          />
        ),
        p: (props) => (
          <p
            className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed"
            {...props}
          />
        ),
        a: ({ href, ...props }) => (
          <a
            href={href}
            className="text-primary dark:text-primary-light underline hover:text-primary-dark dark:hover:text-white transition"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        img: ({ src, alt }) =>
          typeof src === "string" && src ? (
            <Image
              src={src}
              alt={typeof alt === "string" ? alt : ""}
              width={700}
              height={700}
              className="rounded-lg my-6 mx-auto shadow"
              style={{ maxWidth: "100%", height: "auto" }}
              loading="lazy"
            />
          ) : null,
        ul: (props) => (
          <ul
            className="list-disc mr-6 mb-4 text-gray-800 dark:text-gray-200"
            {...props}
          />
        ),
        ol: (props) => (
          <ol
            className="list-decimal mr-6 mb-4 text-gray-800 dark:text-gray-200"
            {...props}
          />
        ),
        li: (props) => <li className="mb-2" {...props} />,
        blockquote: (props) => (
          <blockquote
            className="border-l-4 border-primary dark:border-primary-light pl-4 italic text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#232323] py-2 mb-4"
            {...props}
          />
        ),
        code: (props) => (
          <code
            className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono"
            {...props}
          />
        ),
        pre: (props) => (
          <pre
            className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded p-4 mb-4 overflow-x-auto"
            {...props}
          />
        ),
        hr: () => <hr className="my-8 border-gray-300 dark:border-gray-700" />,
        table: (props) => (
          <table
            className="min-w-full border border-gray-300 dark:border-gray-700 my-6"
            {...props}
          />
        ),
        thead: (props) => (
          <thead className="bg-gray-100 dark:bg-gray-800" {...props} />
        ),
        tbody: (props) => <tbody {...props} />,
        tr: (props) => (
          <tr
            className="border-b border-gray-200 dark:border-gray-700"
            {...props}
          />
        ),
        th: (props) => (
          <th
            className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
            {...props}
          />
        ),
        td: (props) => (
          <td
            className="px-4 py-2 text-gray-700 dark:text-gray-200"
            {...props}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
