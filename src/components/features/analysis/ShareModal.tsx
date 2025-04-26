// src/components/features/analysis/ShareModal.tsx
import { useState } from 'react';
import type { AnalysisResult } from '../../../types/analysis';
import { sharingService } from '../../../services/api/sharingService';

type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisResult | null;
};

export const ShareModal = ({ isOpen, onClose, analysis }: ShareModalProps) => {
  const [shareOption, setShareOption] = useState<'email' | 'slack' | 'discord' | 'link'>('email');
  const [email, setEmail] = useState('');
  const [channel, setChannel] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error',
    text: string
  } | null>(null);
  
  if (!isOpen || !analysis) return null;
  
  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackMessage(null);
    
    try {
      let response;
      
      switch (shareOption) {
        case 'email':
          response = await sharingService.shareViaEmail(analysis, email);
          break;
        case 'slack':
          response = await sharingService.shareViaSlack(analysis, channel);
          break;
        case 'discord':
          response = await sharingService.shareViaDiscord(analysis, channel);
          break;
        default:
          throw new Error('Invalid share option');
      }
      
      if (response.success) {
        setFeedbackMessage({
          type: 'success',
          text: response.message || 'Analysis shared successfully!'
        });
        
        // Close modal after a brief delay
        setTimeout(() => {
          onClose();
          setFeedbackMessage(null);
        }, 2000);
      } else {
        setFeedbackMessage({
          type: 'error',
          text: response.message || 'Failed to share analysis. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error during share operation:', error);
      setFeedbackMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCopyLink = async () => {
    setIsSubmitting(true);
    setFeedbackMessage(null);
    
    try {
      const response = await sharingService.generateShareableLink(analysis);
      
      if (response.success && response.shareUrl) {
        setShareableLink(response.shareUrl);
        await navigator.clipboard.writeText(response.shareUrl);
        
        setCopied(true);
        setFeedbackMessage({
          type: 'success',
          text: 'Link copied to clipboard!'
        });
        
        setTimeout(() => setCopied(false), 2000);
      } else {
        setFeedbackMessage({
          type: 'error',
          text: response.message || 'Failed to generate link. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error generating shareable link:', error);
      setFeedbackMessage({
        type: 'error',
        text: 'Failed to generate link. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 overflow-y-auto flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Share Analysis</h3>
        </div>
        
        <div className="px-6 py-4">
          {/* Feedback message */}
          {feedbackMessage && (
            <div className={`mb-4 p-3 rounded ${
              feedbackMessage.type === 'success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {feedbackMessage.text}
            </div>
          )}
          
          <div className="mb-4">
            <div className="flex space-x-2 mb-4">
              <button
                type="button"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  shareOption === 'email' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}
                onClick={() => setShareOption('email')}
              >
                Email
              </button>
              <button
                type="button"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  shareOption === 'slack' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}
                onClick={() => setShareOption('slack')}
              >
                Slack
              </button>
              <button
                type="button"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  shareOption === 'discord' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}
                onClick={() => setShareOption('discord')}
              >
                Discord
              </button>
              <button
                type="button"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  shareOption === 'link' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}
                onClick={() => setShareOption('link')}
              >
                Link
              </button>
            </div>
            
            <form onSubmit={handleShare}>
              {shareOption === 'email' && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              )}
              
              {(shareOption === 'slack' || shareOption === 'discord') && (
                <div>
                  <label htmlFor="channel" className="block text-sm font-medium text-gray-700">
                    {shareOption === 'slack' ? 'Slack Channel' : 'Discord Channel'}
                  </label>
                  <input
                    type="text"
                    id="channel"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter ${shareOption} channel`}
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    required
                  />
                </div>
              )}
              
              {shareOption === 'link' && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Generate a shareable link to this analysis result
                  </p>
                  
                  {shareableLink && (
                    <div className="mb-3 p-2 bg-gray-50 border rounded flex items-center">
                      <input
                        type="text"
                        className="block w-full bg-transparent border-none text-sm"
                        value={shareableLink}
                        readOnly
                      />
                    </div>
                  )}
                  
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    onClick={handleCopyLink}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Generating...' : copied ? 'Copied to Clipboard!' : 'Generate & Copy Link'}
                  </button>
                </div>
              )}
              
              {shareOption !== 'link' && (
                <div className="mt-4">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Share'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
        
        <div className="px-6 py-3 bg-gray-50 border-t flex justify-end">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};