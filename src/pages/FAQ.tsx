// src/pages/FAQ.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
    >
      <button
        className="flex justify-between items-center w-full py-6 text-left group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-4"
        >
          <FiChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-6 pr-6 pl-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-6">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ: React.FC = () => {
  const faqItems = [
    {
      question: "How does Context Sensei analyze meeting transcripts?",
      answer: "Context Sensei uses advanced AI and natural language processing to analyze meeting transcripts. It automatically identifies tasks, assigns responsibilities, extracts key dates, and determines priorities based on the context of the discussion. Our system employs state-of-the-art machine learning models to understand context and relationships within the text."
    },
    {
      question: "What file formats are supported for transcript analysis?",
      answer: "Context Sensei supports various text formats including plain text (.txt), Word documents (.docx), and transcripts directly copied from popular meeting platforms like Google Meet, Zoom, and Microsoft Teams. Our system can process both structured and unstructured text formats, making it versatile for different use cases."
    },
    {
      question: "How accurate is the task detection?",
      answer: "Our AI model achieves 99% accuracy in task detection through advanced machine learning algorithms and continuous learning from user feedback. The system is particularly good at understanding context and identifying implicit tasks from conversations, reducing the chance of missing important assignments."
    },
    {
      question: "Can I export the analyzed results?",
      answer: "Yes! You can export your analyzed results in multiple formats including TXT, DOCX, XLSX, and PDF. Each export includes a comprehensive summary, key points, and detailed task assignments. The exported documents are professionally formatted and ready to be shared with your team."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We prioritize data security with enterprise-grade encryption, secure local processing, and strict access controls. Your meeting transcripts and analysis results are kept private and protected. We employ industry-standard security protocols and regular security audits to ensure your data remains safe."
    },
    {
      question: "Can I customize the task detection rules?",
      answer: "Yes, Context Sensei allows you to customize task detection rules to match your team's communication style. You can define custom keywords, priority levels, and assignment patterns. This flexibility ensures that the system adapts to your organization's unique needs and workflows."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="inline-block p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
          <FiHelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Find answers to common questions about Context Sensei's features and capabilities
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 divide-y divide-gray-200 dark:divide-gray-700"
      >
        {faqItems.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            index={index}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 text-center"
      >
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Still have questions?
        </p>
        <a
          href="mailto:support@contextsensei.com"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 
            hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold 
            transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          Contact Support
        </a>
      </motion.div>
    </div>
  );
};

export default FAQ;

