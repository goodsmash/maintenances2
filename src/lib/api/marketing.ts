import axios from 'axios';
import { Campaign, Template, AutomationRule } from '@/types/marketing';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const marketingApi = {
  // Campaign Management
  getCampaigns: async () => {
    const response = await axios.get(`${BASE_URL}/api/marketing/campaigns`);
    return response.data;
  },

  createCampaign: async (campaignData: Partial<Campaign>) => {
    const response = await axios.post(
      `${BASE_URL}/api/marketing/campaigns`,
      campaignData
    );
    return response.data;
  },

  updateCampaign: async (
    campaignId: string,
    action: 'start' | 'pause' | 'delete' | Partial<Campaign>
  ) => {
    if (typeof action === 'string') {
      const response = await axios.post(
        `${BASE_URL}/api/marketing/campaigns/${campaignId}/${action}`
      );
      return response.data;
    } else {
      const response = await axios.put(
        `${BASE_URL}/api/marketing/campaigns/${campaignId}`,
        action
      );
      return response.data;
    }
  },

  duplicateCampaign: async (campaignId: string) => {
    const response = await axios.post(
      `${BASE_URL}/api/marketing/campaigns/${campaignId}/duplicate`
    );
    return response.data;
  },

  getCampaignMetrics: async (campaignId: string) => {
    const response = await axios.get(
      `${BASE_URL}/api/marketing/campaigns/${campaignId}/metrics`
    );
    return response.data;
  },

  // Template Management
  getTemplates: async () => {
    const response = await axios.get(`${BASE_URL}/api/marketing/templates`);
    return response.data;
  },

  createTemplate: async (templateData: Partial<Template>) => {
    const response = await axios.post(
      `${BASE_URL}/api/marketing/templates`,
      templateData
    );
    return response.data;
  },

  updateTemplate: async (
    templateId: string,
    templateData: Partial<Template>
  ) => {
    const response = await axios.put(
      `${BASE_URL}/api/marketing/templates/${templateId}`,
      templateData
    );
    return response.data;
  },

  deleteTemplate: async (templateId: string) => {
    const response = await axios.delete(
      `${BASE_URL}/api/marketing/templates/${templateId}`
    );
    return response.data;
  },

  duplicateTemplate: async (templateId: string) => {
    const response = await axios.post(
      `${BASE_URL}/api/marketing/templates/${templateId}/duplicate`
    );
    return response.data;
  },

  // Automation Rules
  getAutomationRules: async () => {
    const response = await axios.get(`${BASE_URL}/api/marketing/rules`);
    return response.data;
  },

  createRule: async (ruleData: Partial<AutomationRule>) => {
    const response = await axios.post(
      `${BASE_URL}/api/marketing/rules`,
      ruleData
    );
    return response.data;
  },

  updateRule: async (
    ruleId: string,
    ruleData: Partial<AutomationRule>
  ) => {
    const response = await axios.put(
      `${BASE_URL}/api/marketing/rules/${ruleId}`,
      ruleData
    );
    return response.data;
  },

  deleteRule: async (ruleId: string) => {
    const response = await axios.delete(
      `${BASE_URL}/api/marketing/rules/${ruleId}`
    );
    return response.data;
  },

  getRuleMetrics: async (ruleId: string) => {
    const response = await axios.get(
      `${BASE_URL}/api/marketing/rules/${ruleId}/metrics`
    );
    return response.data;
  },

  // Audience Management
  getAudiences: async () => {
    const response = await axios.get(`${BASE_URL}/api/marketing/audiences`);
    return response.data;
  },

  createAudience: async (audienceData: any) => {
    const response = await axios.post(
      `${BASE_URL}/api/marketing/audiences`,
      audienceData
    );
    return response.data;
  },

  updateAudience: async (audienceId: string, audienceData: any) => {
    const response = await axios.put(
      `${BASE_URL}/api/marketing/audiences/${audienceId}`,
      audienceData
    );
    return response.data;
  },

  deleteAudience: async (audienceId: string) => {
    const response = await axios.delete(
      `${BASE_URL}/api/marketing/audiences/${audienceId}`
    );
    return response.data;
  },

  // Analytics
  getMarketingAnalytics: async (params: {
    startDate: string;
    endDate: string;
    metrics: string[];
  }) => {
    const response = await axios.get(
      `${BASE_URL}/api/marketing/analytics`,
      { params }
    );
    return response.data;
  },

  // Communication Channels
  getChannels: async () => {
    const response = await axios.get(`${BASE_URL}/api/marketing/channels`);
    return response.data;
  },

  updateChannelSettings: async (
    channelId: string,
    settings: Record<string, any>
  ) => {
    const response = await axios.put(
      `${BASE_URL}/api/marketing/channels/${channelId}`,
      settings
    );
    return response.data;
  },

  // Content Management
  getContent: async (params: {
    type: string;
    status: string;
    page: number;
    limit: number;
  }) => {
    const response = await axios.get(`${BASE_URL}/api/marketing/content`, {
      params,
    });
    return response.data;
  },

  createContent: async (contentData: any) => {
    const response = await axios.post(
      `${BASE_URL}/api/marketing/content`,
      contentData
    );
    return response.data;
  },

  updateContent: async (contentId: string, contentData: any) => {
    const response = await axios.put(
      `${BASE_URL}/api/marketing/content/${contentId}`,
      contentData
    );
    return response.data;
  },

  // A/B Testing
  createTest: async (testData: {
    campaignId: string;
    variants: any[];
    metrics: string[];
    duration: number;
  }) => {
    const response = await axios.post(
      `${BASE_URL}/api/marketing/tests`,
      testData
    );
    return response.data;
  },

  getTestResults: async (testId: string) => {
    const response = await axios.get(
      `${BASE_URL}/api/marketing/tests/${testId}/results`
    );
    return response.data;
  },

  // Personalization
  getPersonalizationRules: async () => {
    const response = await axios.get(
      `${BASE_URL}/api/marketing/personalization`
    );
    return response.data;
  },

  updatePersonalizationRule: async (
    ruleId: string,
    ruleData: any
  ) => {
    const response = await axios.put(
      `${BASE_URL}/api/marketing/personalization/${ruleId}`,
      ruleData
    );
    return response.data;
  },

  // Compliance and Preferences
  getComplianceSettings: async () => {
    const response = await axios.get(
      `${BASE_URL}/api/marketing/compliance`
    );
    return response.data;
  },

  updateComplianceSettings: async (settings: Record<string, any>) => {
    const response = await axios.put(
      `${BASE_URL}/api/marketing/compliance`,
      settings
    );
    return response.data;
  },

  getUserPreferences: async (userId: string) => {
    const response = await axios.get(
      `${BASE_URL}/api/marketing/preferences/${userId}`
    );
    return response.data;
  },

  updateUserPreferences: async (
    userId: string,
    preferences: Record<string, any>
  ) => {
    const response = await axios.put(
      `${BASE_URL}/api/marketing/preferences/${userId}`,
      preferences
    );
    return response.data;
  },
};
