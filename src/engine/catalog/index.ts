import type { Technology, TechIntegration } from '../types';
import { enrichTechnology } from '../extendedCatalog';
import { FRONTEND_TECHNOLOGIES } from './frontend';
import { BACKEND_TECHNOLOGIES } from './backend';
import { DATABASE_TECHNOLOGIES } from './database';
import { AUTH_TECHNOLOGIES } from './auth';
import { STORAGE_TECHNOLOGIES } from './storage';
import { HOSTING_TECHNOLOGIES } from './hosting';
import { PAYMENT_TECHNOLOGIES } from './payments';
import { EMAIL_TECHNOLOGIES } from './email';
import { MONITORING_TECHNOLOGIES } from './monitoring';
import { CICD_TECHNOLOGIES } from './cicd';
import { AI_TECHNOLOGIES } from './ai';
import { QUEUES_TECHNOLOGIES } from './queues';
import { MOBILE_TECHNOLOGIES } from './mobile';
import INTEGRATIONS_MAP_RAW from './integrationsMap.json';

const INTEGRATIONS_MAP = INTEGRATIONS_MAP_RAW as Record<string, Record<string, TechIntegration>>;

const COMBINED_CATALOG: Technology[] = [
  ...FRONTEND_TECHNOLOGIES,
  ...BACKEND_TECHNOLOGIES,
  ...DATABASE_TECHNOLOGIES,
  ...AUTH_TECHNOLOGIES,
  ...STORAGE_TECHNOLOGIES,
  ...HOSTING_TECHNOLOGIES,
  ...PAYMENT_TECHNOLOGIES,
  ...EMAIL_TECHNOLOGIES,
  ...MONITORING_TECHNOLOGIES,
  ...CICD_TECHNOLOGIES,
  ...AI_TECHNOLOGIES,
  ...QUEUES_TECHNOLOGIES,
  ...MOBILE_TECHNOLOGIES,
];

export const TECH_CATALOG: Technology[] = COMBINED_CATALOG.map((tech) => {
  const existingIntegrations = tech.integrations || {};
  const mappedIntegrations = INTEGRATIONS_MAP[tech.id] || {};
  const mergedTech: Technology = {
    ...tech,
    integrations: {
      ...existingIntegrations,
      ...mappedIntegrations,
    },
  };
  return enrichTechnology(mergedTech);
});

export const TECHNOLOGIES: Technology[] = TECH_CATALOG;

export const TECH_BY_ID: Record<string, Technology> = TECH_CATALOG.reduce(
  (acc, tech) => {
    acc[tech.id] = tech;
    return acc;
  },
  {} as Record<string, Technology>
);
