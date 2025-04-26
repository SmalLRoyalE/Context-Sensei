// src/pages/Home.tsx
import React, { useState, useCallback, ReactElement, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiLoader, FiSave, FiEdit3, FiCheckCircle, FiCopy, FiDownload, FiAlertCircle, FiShare2, FiSearch, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { AiOutlineRobot, AiOutlineThunderbolt } from 'react-icons/ai';
import { BsLightningCharge, BsClipboard, BsClipboardCheck, BsLinkedin, BsTwitter, BsWhatsapp, BsDownload, BsChevronDown } from 'react-icons/bs';
import { MdOutlinePrivacyTip, MdEmail } from 'react-icons/md';

// File handling interfaces
interface FileContent {
  name: string;
  content: string;
}

// Error handling interfaces
interface ErrorState {
  message: string;
  code: ErrorCode;
  details?: string;
}

type ErrorCode = 
  | 'FILE_UPLOAD_ERROR'
  | 'FILE_READ_ERROR'
  | 'ANALYSIS_ERROR'
  | 'DOWNLOAD_ERROR'
  | 'API_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN_ERROR';

// Analysis interfaces
interface Task {
  id: string;
  description: string;
  assignedTo: string;
  assignedDate: string;
  deadline: string;
  priority?: 'High' | 'Medium' | 'Low';
  status: 'pending' | 'in_progress' | 'completed';
}

interface Employee {
  name: string;
  tasks: Task[];
  totalTasks: number;
}

interface MeetingDetails {
  date: string;
  startTime: string;
  endTime: string;
  participants: string[];
  summary: string;
}

interface Statistics {
  totalTasks: number;
  highPriorityTasks: number;
  tasksPerPerson: number;
}

interface AnalysisResults {
  employees: Employee[];
  meetingDetails?: MeetingDetails;
  statistics?: Statistics;
}

// API Response interfaces
interface ApiResponse {
  employees: Employee[];
  meetingDetails: MeetingDetails;
  statistics: Statistics;
  error?: {
    message: string;
    code: string;
  };
}

// Component Props interface
interface FeatureCardProps {
  icon: ReactElement;
  title: string;
  description: string;
}

// Feature Card Component
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300">
      {description}
    </p>
  </div>
);

// Share functionality interfaces
interface ShareOption {
  name: string;
  icon: ReactElement;
  handler: (data: AnalysisResults) => void;
}

// Sort functionality types
type SortField = 'name' | 'description' | 'assignedDate' | 'deadline' | 'priority';
type SortOrder = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  order: SortOrder;
}

// Add new interfaces for task editing
interface EditableTask extends Task {
  isEditing?: boolean;
}

const Home: React.FC = () => {
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [showShareMenu, setShowShareMenu] = useState<boolean>(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'name', order: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'High' | 'Medium' | 'Low' | 'all'>('all');

  // Add new state for task editing
  const [editingTask, setEditingTask] = useState<string | null>(null);

  // Error handling utility function
  const handleError = (message: string, code: ErrorCode, details?: string) => {
    setError({ message, code, details });
    // Automatically clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
      if (file) {
        const content = await file.text();
        setFileContent({ name: file.name, content });
        setEditedContent(content);
        setError(null);
      }
    } catch (err) {
      handleError(
        'Failed to read file content',
        'FILE_READ_ERROR',
        err instanceof Error ? err.message : undefined
      );
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/json': ['.json'],
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const handleAnalyze = async (): Promise<void> => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      if (!editedContent.trim()) {
        throw new Error('Please enter some text to analyze.');
      }

      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editedContent })
      }).catch(err => {
        throw new Error('Cannot connect to server. Please make sure the server is running on port 3001.');
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: `Server error: ${response.status}` } }));
        throw new Error(errorData?.error?.message || `Server error: ${response.status}`);
      }

      const results: ApiResponse = await response.json().catch(() => {
        throw new Error('Invalid response from server');
      });
      
      if (results.error) {
        throw new Error(results.error.message);
      }

      setAnalysisResults({
        employees: results.employees,
        meetingDetails: results.meetingDetails,
        statistics: results.statistics
      });
    } catch (err) {
      handleError(
        err instanceof Error ? err.message : 'An unknown error occurred',
        'ANALYSIS_ERROR',
        err instanceof Error ? err.stack : undefined
      );
      setAnalysisResults(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      handleError(
        'Failed to copy text to clipboard',
        'UNKNOWN_ERROR',
        err instanceof Error ? err.message : undefined
      );
    }
  };

  const handleDownloadResults = async (format: 'txt' | 'docx' | 'xlsx' | 'pdf') => {
    try {
      const response = await fetch(`http://localhost:3001/api/export/${format}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: {
            meetingDetails: analysisResults?.meetingDetails,
            tasks: analysisResults?.employees.flatMap(emp => emp.tasks),
            statistics: analysisResults?.statistics
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `task-analysis.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      handleError(
        `Failed to download ${format.toUpperCase()}`,
        'DOWNLOAD_ERROR',
        err instanceof Error ? err.message : undefined
      );
    }
  };

  const downloadOptions = [
    { format: 'txt' as const, icon: <FiFile />, label: 'Download TXT' },
    { format: 'docx' as const, icon: <FiFile />, label: 'Download DOCX' },
    { format: 'xlsx' as const, icon: <FiFile />, label: 'Download Excel' },
    { format: 'pdf' as const, icon: <FiFile />, label: 'Download PDF' }
  ];

  const getPriorityColor = (priority?: string) => {
    if (!priority) return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const shareOptions: ShareOption[] = [
    {
      name: 'LinkedIn',
      icon: <BsLinkedin className="w-5 h-5" />,
      handler: (data: AnalysisResults) => {
        const text = formatDataForSharing(data);
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
      }
    },
    {
      name: 'Twitter',
      icon: <BsTwitter className="w-5 h-5" />,
      handler: (data: AnalysisResults) => {
        const text = formatDataForSharing(data);
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
      }
    },
    {
      name: 'WhatsApp',
      icon: <BsWhatsapp className="w-5 h-5" />,
      handler: (data: AnalysisResults) => {
        const text = formatDataForSharing(data);
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
      }
    },
    {
      name: 'Email',
      icon: <MdEmail className="w-5 h-5" />,
      handler: (data: AnalysisResults) => {
        const text = formatDataForSharing(data);
        const url = `mailto:?subject=Task Analysis Results&body=${encodeURIComponent(text)}`;
        window.location.href = url;
      }
    }
  ];

  const formatDataForSharing = (data: AnalysisResults): string => {
    return data.employees.map(emp => 
      `${emp.name}:\n${emp.tasks.map(task => 
        `- ${task.description} (Priority: ${task.priority}, Deadline: ${task.deadline})`
      ).join('\n')}`
    ).join('\n\n');
  };

  const handleShare = (option: ShareOption) => {
    if (!analysisResults) return;
    option.handler(analysisResults);
    setShowShareMenu(false);
  };

  const handleSort = (field: SortField) => {
    setSortConfig(prevConfig => ({
      field,
      order: prevConfig.field === field && prevConfig.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.order === 'asc' ? (
      <FiChevronUp className="w-4 h-4" />
    ) : (
      <FiChevronDown className="w-4 h-4" />
    );
  };

  const sortedAndFilteredData = useMemo(() => {
    if (!analysisResults) return [];

    let flatData = analysisResults.employees.flatMap(employee =>
      employee.tasks.map(task => ({
        ...task,
        employeeName: employee.name
      }))
    );

    // Apply priority filter
    if (priorityFilter !== 'all') {
      flatData = flatData.filter(item => item.priority === priorityFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      flatData = flatData.filter(item =>
        item.employeeName.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.assignedDate.toLowerCase().includes(searchLower) ||
        item.deadline.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    return flatData.sort((a, b) => {
      let aValue = sortConfig.field === 'name' ? a.employeeName : a[sortConfig.field];
      let bValue = sortConfig.field === 'name' ? b.employeeName : b[sortConfig.field];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortConfig.order === 'asc' ? comparison : -comparison;
      }
      return 0;
    });
  }, [analysisResults, sortConfig, searchTerm, priorityFilter]);

  // Update the handleUpdatePriority function with null checks
  const handleUpdatePriority = async (taskId: string, newPriority: 'High' | 'Medium' | 'Low' | undefined) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority })
      });

      if (!response.ok) {
        throw new Error('Failed to update task priority');
      }

      // Update local state with proper typing and null checks
      setAnalysisResults(prev => {
        if (!prev || !prev.statistics || !prev.meetingDetails) return prev;

        const updatedEmployees = prev.employees.map(emp => ({
          ...emp,
          tasks: emp.tasks.map(task => 
            task.id === taskId 
              ? { ...task, priority: newPriority }
              : task
          )
        }));

        const allTasks = updatedEmployees.flatMap(emp => emp.tasks);
        const highPriorityCount = allTasks.filter(task => task.priority === 'High').length;

        return {
          employees: updatedEmployees,
          statistics: {
            totalTasks: prev.statistics.totalTasks,
            highPriorityTasks: highPriorityCount,
            tasksPerPerson: prev.statistics.tasksPerPerson
          },
          meetingDetails: prev.meetingDetails
        };
      });
    } catch (err) {
      handleError(
        'Failed to update task priority',
        'API_ERROR',
        err instanceof Error ? err.message : undefined
      );
    }
  };

  // Update the task table row rendering
  const renderTaskRow = (item: EditableTask, index: number) => (
    <tr key={item.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {item.assignedTo}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-white">
          {item.description}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {item.assignedDate}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {item.deadline}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {editingTask === item.id ? (
          <select
            value={item.priority || 'none'}
            onChange={(e) => {
              const value = e.target.value;
              handleUpdatePriority(item.id, value === 'none' ? undefined : value as 'High' | 'Medium' | 'Low');
              setEditingTask(null);
            }}
            className="text-sm rounded-md border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              focus:ring-blue-500 focus:border-blue-500"
            autoFocus
            onBlur={() => setEditingTask(null)}
          >
            <option value="none">No Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        ) : (
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setEditingTask(item.id)}
          >
            {item.priority ? (
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(item.priority)}`}>
                {item.priority}
              </span>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Set Priority
              </span>
            )}
            <FiEdit3 className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
          </div>
        )}
      </td>
    </tr>
  );
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Transform Text into{' '}
          <span className="text-blue-600 dark:text-blue-400">Insights</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Upload your text and let our AI extract key information
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <FeatureCard
          icon={<AiOutlineRobot className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          title="AI-Powered Analysis"
          description="Advanced machine learning algorithms analyze your text to extract meaningful insights and key information."
        />
        <FeatureCard
          icon={<BsLightningCharge className="w-6 h-6 text-green-600 dark:text-green-400" />}
          title="Lightning Fast"
          description="Get instant results with our optimized processing engine. Analyze documents in seconds, not minutes."
        />
        <FeatureCard
          icon={<MdOutlinePrivacyTip className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
          title="Privacy First"
          description="Your data stays private and secure. We process everything locally and never store your sensitive information."
        />
            </div>

      {/* File Upload Section */}
      {!fileContent && (
        <div className="mb-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20' 
                : 'border-gray-300 hover:border-blue-400 dark:border-gray-600 dark:hover:border-blue-400'}`}
          >
            <input {...getInputProps()} />
            <FiUpload className="mx-auto h-12 w-12 text-blue-500 dark:text-blue-400" />
            <p className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
              Drag & drop your file here
            </p>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              or click to select a file (TXT, PDF, or JSON)
            </p>
          </div>
        </div>
      )}

      {/* Editor Section */}
      {fileContent && !analysisResults && (
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FiFile className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {fileContent.name}
                </h2>
              </div>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`px-6 py-2 rounded-lg font-medium text-white flex items-center space-x-2
                  ${isAnalyzing 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600'}`}
              >
                {isAnalyzing ? (
                  <>
                    <FiLoader className="animate-spin w-5 h-5" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <AiOutlineRobot className="w-5 h-5" />
                    <span>Analyze Tasks</span>
                  </>
                )}
              </button>
          </div>
          
            <div className="relative">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className={`w-full h-96 p-4 border rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                  resize-none font-mono text-sm leading-relaxed
                  ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder="Enter or paste your text here..."
              />
              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                    <FiAlertCircle className="w-5 h-5" />
                    <p className="text-sm font-medium">{error.message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results Table */}
      {analysisResults && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            {/* Header with Actions */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis Results</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                    transition-colors flex items-center space-x-2"
                >
                  <FiShare2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                      rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors 
                      flex items-center space-x-2"
                  >
                    <FiDownload className="w-5 h-5" />
                    <span>Download</span>
                    <BsChevronDown className="w-4 h-4" />
                  </button>
                  {/* Download Menu */}
                  {showDownloadMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg 
                      shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="py-2">
                        {downloadOptions.map(({ format, icon, label }) => (
                          <button
                            key={format}
                            onClick={() => {
                              handleDownloadResults(format);
                              setShowDownloadMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left flex items-center space-x-3 
                              hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            {icon}
                            <span className="text-gray-700 dark:text-gray-300">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Meeting Overview Section */}
            {analysisResults.meetingDetails && (
              <div className="mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Summary Card */}
                  <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 
                      rounded-xl p-6 h-full border border-blue-100 dark:border-blue-800">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Meeting Summary
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                        {analysisResults.meetingDetails.summary}
                      </p>
                    </div>
                  </div>

                  {/* Meeting Details Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Meeting Details
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {analysisResults.meetingDetails.date}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {analysisResults.meetingDetails.startTime} - {analysisResults.meetingDetails.endTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Participants</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {analysisResults.meetingDetails.participants.map((participant, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm 
                                font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            >
                              {participant}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Key Points Section */}
            {analysisResults.meetingDetails && (
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Key Points & Decisions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisResults.employees.map((employee, index) => (
                    employee.tasks.filter(task => task.priority === 'High').map((task, taskIndex) => (
                      <div
                        key={`${index}-${taskIndex}`}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 
                          dark:border-gray-700 flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0">
                          <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 
                            flex items-center justify-center">
                            <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" 
                              stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-900 dark:text-white font-medium">{task.description}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Assigned to {employee.name} • Due {task.deadline}
                          </p>
                        </div>
                      </div>
                    ))
                  ))}
                </div>
              </div>
            )}

            {/* Statistics Cards */}
            {analysisResults.statistics && (
              <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 
                  rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Tasks</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {analysisResults.statistics.totalTasks}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 
                  rounded-xl p-6 border border-red-200 dark:border-red-800">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">High Priority</p>
                      <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                        {analysisResults.statistics.highPriorityTasks}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 
                  rounded-xl p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">Tasks per Person</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {analysisResults.statistics.tasksPerPerson.toFixed(1)}
            </p>
          </div>
        </div>
      </div>
      
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 
                  rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Completion Rate</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {((analysisResults.statistics.totalTasks - 
                          analysisResults.statistics.highPriorityTasks) / 
                          analysisResults.statistics.totalTasks * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search and Filter Controls */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks, employees, dates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>

            {/* Task Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    {[
                      { field: 'name', label: 'Employee' },
                      { field: 'description', label: 'Tasks' },
                      { field: 'assignedDate', label: 'Date Assigned' },
                      { field: 'deadline', label: 'Deadline' },
                      { field: 'priority', label: 'Priority' }
                    ].map(({ field, label }) => (
                      <th
                        key={field}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 
                          uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50
                          transition-colors group"
                        onClick={() => handleSort(field as SortField)}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{label}</span>
                          <span className="text-gray-400 dark:text-gray-500">
                            {getSortIcon(field as SortField)}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedAndFilteredData.map((item, index) => renderTaskRow(item, index))}
                </tbody>
              </table>

              {/* No Results Message */}
              {sortedAndFilteredData.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No tasks found matching your criteria.
                  </p>
                </div>
              )}
      </div>
      
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setFileContent(null);
                  setEditedContent('');
                  setAnalysisResults(null);
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
                  bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 
                  transition-colors flex items-center space-x-2"
              >
                <FiUpload className="w-5 h-5" />
                <span>Analyze New Text</span>
              </button>
            </div>
          </div>

          {/* Add Meeting Details Section */}
          {analysisResults?.meetingDetails && (
            <div className="mb-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Meeting Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Date:</span> {analysisResults.meetingDetails.date}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Time:</span> {analysisResults.meetingDetails.startTime} - {analysisResults.meetingDetails.endTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Participants:</span> {analysisResults.meetingDetails.participants.join(', ')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Summary:</span> {analysisResults.meetingDetails.summary}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Add Statistics Section */}
          {analysisResults?.statistics && (
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h5 className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Tasks</h5>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {analysisResults.statistics.totalTasks}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <h5 className="text-sm font-medium text-red-600 dark:text-red-400">High Priority</h5>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {analysisResults.statistics.highPriorityTasks}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h5 className="text-sm font-medium text-green-600 dark:text-green-400">Tasks per Person</h5>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {analysisResults.statistics.tasksPerPerson.toFixed(1)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 max-w-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-2">
            <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {error.message}
              </p>
              {error.details && (
                <p className="text-xs text-red-500 dark:text-red-500 mt-1">
                  {error.details}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;