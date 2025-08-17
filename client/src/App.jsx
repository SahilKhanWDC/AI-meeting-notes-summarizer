import React, { useState } from 'react';
import TranscriptInput from './components/TranscriptInput.jsx';
import PromptInput from './components/PromptInput.jsx';
import SummaryOutput from './components/SummaryOutput.jsx';
import EmailShare from './components/EmailShare.jsx';
import axios from 'axios';

function App() {
  const [transcript, setTranscript] = useState('');
  const [prompt, setPrompt] = useState('Please summarize this meeting in bullet points, highlighting key decisions and action items.');
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  const handleGenerateSummary = async () => {
    if (!transcript.trim()) {
      showNotification('Please enter a meeting transcript first.', 'error');
      return;
    }

    if (!prompt.trim()) {
      showNotification('Please enter a custom prompt.', 'error');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await axios.post('/api/generate-summary', {
        transcript,
        prompt
      });

      if (response.data.success) {
        setSummary(response.data.summary);
        showNotification('Summary generated successfully!', 'success');
      } else {
        throw new Error(response.data.error || 'Failed to generate summary');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to generate summary';
      showNotification(errorMessage, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Meeting Notes Summarizer
          </h1>
          <p className="text-lg text-gray-600">
            Transform your meeting transcripts into structured summaries and share them via email
          </p>
        </div>

        {/* Notification */}
        {notification.message && (
          <div className={`mb-6 p-4 rounded-lg ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' :
            notification.type === 'error' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {notification.message}
          </div>
        )}

        <div className="space-y-6">
          {/* Step 1: Upload/Input Transcript */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                1
              </span>
              Upload or Paste Meeting Transcript
            </h2>
            <TranscriptInput 
              transcript={transcript}
              setTranscript={setTranscript}
              showNotification={showNotification}
            />
          </div>

          {/* Step 2: Custom Prompt */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                2
              </span>
              Customize Summary Instructions
            </h2>
            <PromptInput 
              prompt={prompt}
              setPrompt={setPrompt}
            />
          </div>

          {/* Step 3: Generate Summary */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                3
              </span>
              Generate AI Summary
            </h2>
            <button
              onClick={handleGenerateSummary}
              disabled={isGenerating || !transcript.trim() || !prompt.trim()}
              className="btn-primary w-full sm:w-auto flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Summary...
                </>
              ) : (
                <>
                  Generate Summary
                </>
              )}
            </button>
          </div>

          {/* Step 4: Summary Output */}
          {summary && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  4
                </span>
                Edit Summary
              </h2>
              <SummaryOutput 
                summary={summary}
                setSummary={setSummary}
              />
            </div>
          )}

          {/* Step 5: Share via Email */}
          {summary && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  5
                </span>
                Share via Email
              </h2>
              <EmailShare 
                summary={summary}
                showNotification={showNotification}
              />
            </div>
          )}
        </div>

        {/* Footer
        <div className="text-center mt-12 text-gray-500">
          <p>Built with React, Express.js, and A</p>
        </div> */}
      </div>
    </div>
  );
}

export default App;