import React from 'react';

function PromptInput({ prompt, setPrompt }) {
  const presetPrompts = [
    {
      name: 'Bullet Points Summary',
      prompt: 'Please summarize this meeting in bullet points, highlighting key decisions and action items.'
    },
    {
      name: 'Executive Summary',
      prompt: 'Create a concise executive summary of this meeting, focusing on strategic decisions and business impact.'
    },
    {
      name: 'Action Items Focus',
      prompt: 'Extract and organize all action items from this meeting, including assignees and deadlines.'
    },
    {
      name: 'Technical Summary',
      prompt: 'Summarize the technical aspects discussed in this meeting, including solutions proposed and implementation details.'
    },
    {
      name: 'Meeting Minutes',
      prompt: 'Format this as formal meeting minutes with sections for attendees, agenda items, decisions made, and next steps.'
    }
  ];

  const handlePresetClick = (presetPrompt) => {
    setPrompt(presetPrompt);
  };

  const handleTextChange = (e) => {
    setPrompt(e.target.value);
  };

  return (
    <div className="space-y-4">
      {/* Preset Prompts */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Preset Options
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {presetPrompts.map((preset, index) => (
            <button
              key={index}
              onClick={() => handlePresetClick(preset.prompt)}
              className={`text-left p-3 rounded-lg border-2 transition-colors duration-200 ${
                prompt === preset.prompt
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium text-sm">{preset.name}</div>
              <div className="text-xs text-gray-500 mt-1 truncate">
                {preset.prompt.substring(0, 50)}...
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Prompt Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Instructions
        </label>
        <textarea
          value={prompt}
          onChange={handleTextChange}
          placeholder="Enter your custom summarization instructions..."
          rows={4}
          className="input-field w-full resize-y"
        />
        <div className="mt-2 text-xs text-gray-500">
          Be specific about the format, focus areas, and level of detail you want in your summary.
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Pro Tips:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Be specific about the output format (bullets, paragraphs, sections)</li>
          <li>• Mention what to prioritize (decisions, action items, technical details)</li>
          <li>• Specify the intended audience (executives, technical team, stakeholders)</li>
          <li>• Include word count or length preferences if needed</li>
        </ul>
      </div>
    </div>
  );
}

export default PromptInput;