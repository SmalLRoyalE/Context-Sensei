// src/pages/About.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiCpu, FiLock, FiUsers, FiGlobe, FiAward, FiTrendingUp, FiShield } from 'react-icons/fi';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}> = ({ icon, title, description, delay }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.6, delay }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300
        transform hover:scale-105 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const TeamMember: React.FC<{
  name: string;
  role: string;
  image: string;
  delay: number;
}> = ({ name, role, image, delay }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.5, delay }}
      className="text-center group"
    >
      <div className="relative w-32 h-32 mx-auto mb-4 transform group-hover:scale-105 transition-transform duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-75 blur-lg group-hover:opacity-100 transition-opacity"></div>
        <img
          src={image}
          alt={name}
          className="relative w-full h-full object-cover rounded-full border-4 border-white dark:border-gray-800"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
      <p className="text-gray-600 dark:text-gray-400">{role}</p>
    </motion.div>
  );
};

const About: React.FC = () => {
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: <FiCpu className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms for precise task extraction and context understanding.',
    },
    {
      icon: <FiLock className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: 'Secure & Private',
      description: 'Your data stays private with enterprise-grade security and local processing.',
    },
    {
      icon: <FiUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: 'Team Collaboration',
      description: 'Foster seamless teamwork with real-time task sharing, role assignments, and integrated communication tools.',
    },
    {
      icon: <FiGlobe className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: 'Multi-Platform Support',
      description: 'Works with popular platforms like Google Meet, Discord, and more.',
    },
    {
      icon: <FiAward className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: 'Best-in-Class Accuracy',
      description: 'Industry-leading task detection and assignment accuracy.',
    },
    {
      icon: <FiTrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: 'Analytics & Insights',
      description: 'Comprehensive analytics to track team productivity and task distribution.',
    }
  ];

  const team = [
    {
      name: 'AI Assistant',
      role: 'Task Analysis Expert',
      image: '/ai-assistant.png',
    },
    {
      name: 'ML Model',
      role: 'Context Understanding',
      image: '/ml-model.png',
    },
    {
      name: 'Neural Network',
      role: 'Pattern Recognition',
      image: '/neural-network.png',
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0, y: 30 }}
        animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Transform Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Meeting Transcripts
          </span>
          <br />
          Into Actionable Tasks
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Context Sensei uses advanced AI to analyze your meeting transcripts,
          automatically extracting tasks, assigning responsibilities, and tracking progress.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            delay={index * 0.1}
          />
        ))}
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 mb-16 transform hover:scale-105 transition-transform duration-300"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white">99%</h3>
            <p className="text-blue-100">Task Detection Accuracy</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white">50+</h3>
            <p className="text-blue-100">Supported Platforms</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white">24/7</h3>
            <p className="text-blue-100">AI-Powered Support</p>
          </div>
        </div>
      </motion.div>

      {/* Team Section */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Powered by Advanced AI
        </h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {team.map((member, index) => (
            <TeamMember
              key={member.name}
              name={member.name}
              role={member.role}
              image={member.image}
              delay={index * 0.2}
            />
          ))}
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="text-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/30 rounded-2xl p-12
          transform hover:scale-105 transition-transform duration-300"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Transform your meeting transcripts into actionable tasks today.
        </p>
        <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
          text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
          Try Context Sensei Now
        </button>
      </motion.div>
    </div>
  );
};

export default About;

