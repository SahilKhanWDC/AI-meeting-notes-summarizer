import React, { useState } from 'react';
import axios from 'axios';

function EmailShare({ summary, showNotification }) {
  const [emailInput, setEmailInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [recipients, setRecipients] = useState([]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addEmail = () => {
    const email = emailInput.trim();
    
    if (!email) {
      showNotification('Please enter an email address', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    if (recipients.includes(email)) {
      showNotification('Email already added', 'error');
      return;
    }

    setRecipients([...recipients, email]);
    setEmailInput('');
  };

  const removeEmail = (emailToRemove) => {
    setRecipients(recipients.filter(email => email !== emailToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  const parseEmailsFromText = (text) => {
    const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
    const foundEmails = text.match(emailRegex) || [];
    const validEmails = foundEmails.filter(email => validateEmail(email));
    const uniqueEmails = [...new Set([...recipients, ...validEmails])];
    setRecipients(uniqueEmails);
    setEmailInput('');
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setEmailInput(value);

    // Auto-detect comma or semicolon separated emails
    if (value.includes(',') || value.includes(';')) {
      parseEmailsFromText(value);
    }
  };

  const sendEmail = async () => {
    if (recipients.length === 0) {
      showNotification('Please add at least one recipient', 'error');
      return;
    }

    if (!summary.trim()) {
      showNotification('Summary cannot be empty', 'error');
      return;
    }

    setIsSending(true);

    try {
      const response = await axios.post('/api/send-email', {
        summary,
        recipients
      });

      if (response.data.success) {
        showNotification(response.data.message, 'success');
        setRecipients([]);
        setEmailInput('');
      } else {
        throw new Error(response.data.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to send email';
      showNotification(errorMessage, 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Email Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recipient Email Addresses
        </label>
        <div className="flex gap-2">
          <input
            type="email"
            value={emailInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter email address (e.g., colleague@company.com)"
            className="input-field flex-1"
          />
          <button
            onClick={addEmail}
            disabled={!emailInput.trim()}
            className="btn-primary px-6"
          >
            Add
          </button>
        </div>
        <div className="mt-1 text-xs text-gray-500">
          You can also paste multiple emails separated by commas or semicolons
        </div>
      </div>

      {/* Recipients List */}
      {recipients.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipients ({recipients.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {recipients.map((email, index) => (
              <div
                key={index}
                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                <span>{email}</span>
                <button
                  onClick={() => removeEmail(email)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Email Templates */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Add Common Recipients
        </label>
        <div className="flex flex-wrap gap-2">
          {['team@company.com', 'manager@company.com', 'stakeholders@company.com'].map((template, index) => (
            <button
              key={index}
              onClick={() => {
                if (!recipients.includes(template)) {
                  setRecipients([...recipients, template]);
                }
              }}
              disabled={recipients.includes(template)}
              className="btn-secondary text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + {template}
            </button>
          ))}
        </div>
      </div>

      {/* Send Email Button */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <div className="font-medium text-gray-900">Ready to send?</div>
          <div className="text-sm text-gray-500">
            {recipients.length > 0 
              ? `Email will be sent to ${recipients.length} recipient${recipients.length > 1 ? 's' : ''}`
              : 'Add recipients to send summary'
            }
          </div>
        </div>
        <button
          onClick={sendEmail}
          disabled={isSending || recipients.length === 0 || !summary.trim()}
          className="btn-primary flex items-center"
        >
          {isSending ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send via Email
            </>
          )}
        </button>
      </div>

      {/* Email Configuration Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">Email Configuration</h4>
        <p className="text-sm text-yellow-700">
          If you haven't configured email settings in the server's <code className="bg-yellow-100 px-1 rounded">.env</code> file,
          the system will simulate sending emails for testing purposes. To send real emails, configure:
        </p>
        <ul className="text-xs text-yellow-600 mt-2 space-y-1">
          <li>• <code>EMAIL_USER</code> - Your email address</li>
          <li>• <code>EMAIL_PASS</code> - Your app password</li>
          <li>• <code>EMAIL_HOST</code> - SMTP host (default: smtp.gmail.com)</li>
        </ul>
      </div>
    </div>
  );
}

export default EmailShare;