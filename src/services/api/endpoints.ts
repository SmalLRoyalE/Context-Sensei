// src/services/api/endpoints.ts

/**
 * Central configuration of all API endpoints used in the application
 */
export const endpoints = {
  transcript: {
    upload: '/transcripts/upload',
    getById: (id: string) => `/transcripts/${id}`,
    update: (id: string) => `/transcripts/${id}`,
    delete: (id: string) => `/transcripts/${id}`,
    list: '/transcripts',
  },
  
  analysis: {
    create: '/analyze',
    getById: (id: string) => `/analysis/${id}`,
    delete: (id: string) => `/analysis/${id}`,
    list: '/analysis',
  },
  
  share: {
    email: '/share/email',
    slack: '/share/slack',
    discord: '/share/discord',
    generateLink: '/share/link',
    getShared: (shareId: string) => `/shared/${shareId}`,
  },
  
  user: {
    login: '/auth/login',
    register: '/auth/register',
    profile: '/auth/profile',
    logout: '/auth/logout',
  },
  
  integrations: {
    slack: {
      connect: '/integrations/slack/connect',
      disconnect: '/integrations/slack/disconnect',
      channels: '/integrations/slack/channels',
    },
    discord: {
      connect: '/integrations/discord/connect',
      disconnect: '/integrations/discord/disconnect',
      channels: '/integrations/discord/channels',
    },
    googleMeet: {
      connect: '/integrations/google-meet/connect',
      disconnect: '/integrations/google-meet/disconnect',
    }
  }
};

