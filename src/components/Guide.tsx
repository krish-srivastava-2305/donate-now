import React, { useState } from 'react';

type ContentItem = {
  title: string;
  description: string;
  content: React.ReactElement;
};

type GuideProps = {
  content: ContentItem[];
};

function Guide({ content }: GuideProps) {
  const [guide, setGuide] = useState<React.ReactElement>(content[0].content);

  return (
    <div className="z-10 flex items-center justify-evenly w-full h-[80vh] p-4">
      <div className="flex flex-col justify-center w-2/5 h-full p-2 gap-6">
        {content.map((item, index) => (
          <button
            key={index}
            onClick={() => setGuide(item.content)}
            className="p-6 text-2xl font-bold text-black duration-300 ease-in-out transform hover:translate-x-4"
          >
            → {item.title}
          </button>
        ))}
      </div>
      <div className="w-2/5 h-full p-6 rounded-lg shadow-lg">
        {guide}
      </div>
    </div>
  );
}

export default Guide;
