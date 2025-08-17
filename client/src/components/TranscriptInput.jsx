import React, { useRef } from 'react';

function TranscriptInput({ transcript, setTranscript, showNotification }) {
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (file.type !== 'text/plain') {
      showNotification('Please select a .txt file', 'error');
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showNotification('File size must be less than 10MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setTranscript(content);
      showNotification('File uploaded successfully!', 'success');
    };
    reader.onerror = () => {
      showNotification('Failed to read file', 'error');
    };
    reader.readAsText(file);
  };

  const handleTextareaChange = (e) => {
    setTranscript(e.target.value);
  };

  const clearTranscript = () => {
    setTranscript('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* File Upload */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Transcript File (.txt)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
        </div>
        {transcript && (
          <button
            onClick={clearTranscript}
            className="btn-secondary self-end"
          >
            Clear
          </button>
        )}
      </div>

      {/* Text Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Or Paste Transcript Here
        </label>
        <textarea
          value={transcript}
          onChange={handleTextareaChange}
          placeholder="Paste your meeting transcript here or upload a .txt file above..."
          rows={10}
          className="input-field w-full resize-y"
        />
        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
          <span>
            {transcript.length.toLocaleString()} characters
          </span>
          <span>
            {transcript.split(' ').filter(word => word.trim()).length.toLocaleString()} words
          </span>
        </div>
      </div>

      {/* Sample Text Button */}
      <div>
        <button
          onClick={() => {
            const sampleTranscript = `Meeting: Weekly Team Standup
Date: Today
Attendees: Alice, Bob, Carol, David

Alice: Good morning everyone. Let's start with our weekly standup. Bob, can you share your updates?

Bob: Sure! I completed the user authentication module last week. I'm currently working on the password reset functionality and should have it done by Thursday. No blockers right now.

Alice: Great work, Bob. Carol, your turn.

Carol: I finished the UI mockups for the dashboard and got approval from the design team. This week I'm implementing the responsive layout. I might need some help with the mobile optimization - David, could we pair on that tomorrow?

David: Absolutely! I'll block out time tomorrow afternoon. On my end, I wrapped up the database schema optimization. Performance improved by 40%. This week I'm focusing on the API documentation and will help Carol with the mobile stuff.

Alice: Excellent progress everyone. One quick announcement - we're moving the project deadline up by one week due to the client's request. I know it's tight, but I believe we can make it happen. Any concerns?

Bob: Should be doable if we stay focused. Maybe we can postpone the nice-to-have features?

Carol: Agreed. Let's prioritize core functionality.

David: I can work extra hours if needed. The API docs can wait.

Alice: Perfect. Let's reconvene on Friday to assess our progress. Thanks everyone!`;
            setTranscript(sampleTranscript);
            showNotification('Sample transcript loaded!', 'success');
          }}
          className="btn-secondary text-sm"
        >
          Load Sample Transcript
        </button>
      </div>
    </div>
  );
}

export default TranscriptInput;