
import React from 'react';

interface CodeViewerProps {
  code: string;
}

const SyntaxHighlightedCode: React.FC<{ code: string }> = ({ code }) => {
    const lines = code.split('\n').map((line, i) => {
        let formattedLine = line
            .replace(/^(\s*)(\w+):/gm, '$1<span class="text-blue-400">$2</span>:') // Keys
            .replace(/(\s-\s)(.*)/g, '$1<span class="text-green-400">$2</span>') // Array items
            .replace(/#.*/g, '<span class="text-gray-500">$&</span>') // Comments
            .replace(/\|/g, '<span class="text-yellow-400">|</span>'); // pipe for multi-line

        return (
            <div key={i} className="flex">
                <span className="w-8 text-right text-gray-500 pr-4 select-none">{i + 1}</span>
                <span className="flex-1" dangerouslySetInnerHTML={{ __html: formattedLine }} />
            </div>
        );
    });

    return <>{lines}</>;
}


export const CodeViewer: React.FC<CodeViewerProps> = ({ code }) => {
  return (
    <div className="bg-gray-900 p-4 font-mono text-sm text-gray-300 h-full overflow-auto">
      <pre>
          <code>
             <SyntaxHighlightedCode code={code} />
          </code>
      </pre>
    </div>
  );
};
