import api from '@/lib/api';

import type { FooterContent, LandingContent, NavigationContent, SiteContent } from './types';

export interface NavigationPayload extends NavigationContent {
  brand: SiteContent['brand'];
}

export const contentService = {
  all: async (): Promise<SiteContent> => {
    const { data } = await api.get<SiteContent>('/content');
    return data;
  },
  navigation: async (): Promise<NavigationPayload> => {
    const { data } = await api.get<NavigationPayload>('/content/navigation');
    return data;
  },
  footer: async (): Promise<FooterContent> => {
    const { data } = await api.get<FooterContent>('/content/footer');
    return data;
  },
  landing: async (): Promise<LandingContent> => {
    const { data } = await api.get<LandingContent>('/content/landing');
    return data;
  },
};
