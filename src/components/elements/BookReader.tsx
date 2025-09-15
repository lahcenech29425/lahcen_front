"use client";

interface BookReaderProps {
  url: string;
  title?: string;
  height?: string; // hauteur personnalisable
}

export default function BookReader({ url, title = "Book Reader", height = "600px" }: BookReaderProps) {
  return (
    <div className="max-w-4xl mx-auto py-4 px-4">
      {title && (
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-gray-900">
          {title}
        </h2>
      )}

      <div
        className={`w-full border rounded-lg overflow-hidden shadow`}
        style={{ height }}
      >
        <iframe
          src={url}
          title={title}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
