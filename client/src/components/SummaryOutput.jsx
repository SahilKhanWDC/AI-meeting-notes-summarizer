import React, { useState } from 'react';

function SummaryOutput({ summary, setSummary }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleSummaryChange = (e) => {
    setSummary(e.target.value);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadAsText = () => {
    const element = document.createElement('a');
    const file = new Blob([summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `meeting-summary-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearSummary = () => {
    setSummary('');
  };

  const wordCount = summary.split(' ').filter(word => word.trim()).length;
  const charCount = summary.length;

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={copyToClipboard}
          className="btn-secondary flex items-center"
        >
          {isCopied ? (
            <>
              <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
        
        <button
          onClick={downloadAsText}
          className="btn-secondary flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download
        </button>

        <button
          onClick={clearSummary}
          className="btn-secondary text-red-600 hover:bg-red-50 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear
        </button>
      </div>

      {/* Summary Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Generated Summary (Editable)
        </label>
        <textarea
          value={summary}
          onChange={handleSummaryChange}
          rows={15}
          className="input-field w-full resize-y font-mono text-sm"
          placeholder="Your generated summary will appear here..."
        />
      </div>

      {/* Statistics */}
      <div className="flex flex-wrap justify-between items-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
        <div className="flex flex-wrap gap-4">
          <span>{wordCount.toLocaleString()} words</span>
          <span>{charCount.toLocaleString()} characters</span>
          <span>{Math.ceil(wordCount / 250)} min read</span>
        </div>
        <div className="text-xs text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Preview Card */}
      {summary && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Summary Preview</h4>
          <div className="text-sm text-blue-800 bg-white p-3 rounded border max-h-32 overflow-y-auto">
            <pre className="whitespace-pre-wrap font-sans">
              {summary.substring(0, 200)}
              {summary.length > 200 && '...'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default SummaryOutput;