import { describe, it, expect, beforeEach } from 'vitest';
import { ConfigGenerator, type AgentWeaverConfig } from '../src/lib/config-generator.js';

describe('Tech Stack Markdown Generation', () => {
  let mockConfig: AgentWeaverConfig;

  beforeEach(() => {
    mockConfig = {
      project: {
        name: 'test-project',
        type: 'web-application',
        description: 'Test project for markdown generation',
      },
      techStack: {
        mode: 'flexible',
        frontend: {
          framework: 'react',
          version: '18.2.0',
          styling: 'tailwindcss',
          stateManagement: 'redux',
        },
        backend: {
          framework: 'express',
          runtime: 'node',
          language: 'typescript',
        },
        database: {
          primary: 'postgresql',
          version: '15',
          orm: 'prisma',
        },
        testing: {
          unit: 'vitest',
          integration: 'supertest',
          e2e: 'playwright',
        },
        deployment: {
          platform: 'vercel',
          containerization: 'docker',
          ci: 'github-actions',
        },
      },
    };
  });

  describe('generateTechStackMarkdown', () => {
    it('should generate valid markdown with header', () => {
      const markdown = ConfigGenerator.generateTechStackMarkdown(mockConfig);

      expect(markdown).toContain('# Tech Stack Overview');
      expect(markdown).toContain('<!-- AUTO-GENERATED from agentweaver.config.yml -->');
      expect(markdown).toContain('<!-- DO NOT EDIT MANUALLY - Changes will be overwritten -->');
    });

    it('should include tech stack mode section', () => {
      const markdown = ConfigGenerator.generateTechStackMarkdown(mockConfig);

      expect(markdown).toContain('## Stack Mode');
      expect(markdown).toContain('**flexible**');
      expect(markdown).toContain(
        'Agents **prefer** the specified stack but can suggest alternatives with clear justification (default).'
      );
    });

    it('should include technologies table', () => {
      const markdown = ConfigGenerator.generateTechStackMarkdown(mockConfig);

      expect(markdown).toContain('## Technologies');
      expect(markdown).toContain('| Category | Technology | Details |');
      expect(markdown).toContain('|----------|------------|---------|');
    });

    it('should include frontend technologies', () => {
      const markdown = ConfigGenerator.generateTechStackMarkdown(mockConfig);

      expect(markdown).toContain('**Frontend**');
      expect(markdown).toContain('Framework');
      expect(markdown).toContain('react (v18.2.0)');
      expect(markdown).toContain('Styling');
      expect(markdown).toContain('tailwindcss');
      expect(markdown).toContain('State Management');
      expect(markdown).toContain('redux');
    });

    it('should include backend technologies', () => {
      const markdown = ConfigGenerator.generateTechStackMarkdown(mockConfig);

      expect(markdown).toContain('**Backend**');
      expect(markdown).toContain('Framework');
      expect(markdown).toContain('express');
      expect(markdown).toContain('Runtime');
      expect(markdown).toContain('node');
      expect(markdown).toContain('Language');
      expect(markdown).toContain('typescript');
    });

    it('should include database technologies', () => {
      const markdown = ConfigGenerator.generateTechStackMarkdown(mockConfig);

      expect(markdown).toContain('**Database**');
      expect(markdown).toContain('Primary');
      expect(markdown).toContain('postgresql (v15)');
      expect(markdown).toContain('ORM');
      expect(markdown).toContain('prisma');
    });

    it('should include testing technologies', () => {
      const markdown = ConfigGenerator.generateTechStackMarkdown(mockConfig);

      expect(markdown).toContain('**Testing**');
      expect(markdown).toContain('Unit Testing');
      expect(markdown).toContain('vitest');
      expect(markdown).toContain('Integration Testing');
      expect(markdown).toContain('supertest');
      expect(markdown).toContain('E2E Testing');
      expect(markdown).toContain('playwright');
    });

    it('should include deployment technologies', () => {
      const markdown = ConfigGenerator.generateTechStackMarkdown(mockConfig);

      expect(markdown).toContain('**Deployment**');
      expect(markdown).toContain('Platform');
      expect(markdown).toContain('vercel');
      expect(markdown).toContain('Containerization');
      expect(markdown).toContain('docker');
      expect(markdown).toContain('CI/CD');
      expect(markdown).toContain('github-actions');
    });

    it('should include quick reference section', () => {
      const markdown = ConfigGenerator.generateTechStackMarkdown(mockConfig);

      expect(markdown).toContain('## Quick Reference');
      expect(markdown).toContain('**Frontend**: react, tailwindcss, redux');
      expect(markdown).toContain('**Backend**: express, node, typescript');
      expect(markdown).toContain('**Database**: postgresql, prisma');
      expect(markdown).toContain('**Testing**: vitest, supertest, playwright');
      expect(markdown).toContain('**Deployment**: vercel, docker, github-actions');
    });

    it('should handle strict mode', () => {
      mockConfig.techStack.mode = 'strict';
      const markdown = ConfigGenerator.generateTechStackMarkdown(mockConfig);

      expect(markdown).toContain('**strict**');
      expect(markdown).toContain(
        'Agents **MUST** use only the specified technologies without exceptions.'
      );
    });

    it('should handle adaptive mode', () => {
      mockConfig.techStack.mode = 'adaptive';
      const markdown = ConfigGenerator.generateTechStackMarkdown(mockConfig);

      expect(markdown).toContain('**adaptive**');
      expect(markdown).toContain(
        'Agents **auto-detect** and adapt to project patterns, using config as guidance.'
      );
    });

    it('should handle missing optional fields gracefully', () => {
      const minimalConfig: AgentWeaverConfig = {
        project: {
          name: 'minimal-project',
          type: 'cli',
        },
        techStack: {
          mode: 'flexible',
          frontend: {},
          backend: {},
          database: {},
          testing: {},
          deployment: {},
        },
      };

      const markdown = ConfigGenerator.generateTechStackMarkdown(minimalConfig);

      expect(markdown).toContain('# Tech Stack Overview');
      expect(markdown).toContain('## Stack Mode');
      expect(markdown).toContain('## Technologies');
      expect(markdown).not.toContain('undefined');
    });

    it('should format version numbers correctly', () => {
      mockConfig.techStack.frontend.version = '18.3.0';
      mockConfig.techStack.database.version = '16.2';

      const markdown = ConfigGenerator.generateTechStackMarkdown(mockConfig);

      expect(markdown).toContain('(v18.3.0)');
      expect(markdown).toContain('(v16.2)');
    });

    it('should capitalize category names', () => {
      const markdown = ConfigGenerator.generateTechStackMarkdown(mockConfig);

      expect(markdown).toContain('**Frontend**');
      expect(markdown).toContain('**Backend**');
      expect(markdown).toContain('**Database**');
      expect(markdown).toContain('**Testing**');
      expect(markdown).toContain('**Deployment**');
    });

    it('should generate valid markdown table structure', () => {
      const markdown = ConfigGenerator.generateTechStackMarkdown(mockConfig);

      const lines = markdown.split('\n');
      const tableStart = lines.findIndex((line) => line.includes('| Category | Technology | Details |'));

      expect(tableStart).toBeGreaterThan(-1);
      expect(lines[tableStart + 1]).toContain('|----------|------------|---------|');

      // Check that subsequent lines have proper table format
      for (let i = tableStart + 2; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim() || line.startsWith('##')) break;
        if (line.includes('|')) {
          expect(line.split('|').length).toBeGreaterThanOrEqual(4); // At least 3 columns + 2 edge pipes
        }
      }
    });

    it('should include timestamp in header', () => {
      const markdown = ConfigGenerator.generateTechStackMarkdown(mockConfig);

      expect(markdown).toMatch(/Last updated: \d{4}-\d{2}-\d{2}/);
    });

    it('should handle special characters in technology names', () => {
      mockConfig.techStack.frontend.framework = '@react/18.2.0';
      mockConfig.techStack.backend.framework = 'express.js';

      const markdown = ConfigGenerator.generateTechStackMarkdown(mockConfig);

      expect(markdown).toContain('@react/18.2.0');
      expect(markdown).toContain('express.js');
    });

    it('should preserve field order: frontend, backend, database, testing, deployment', () => {
      const markdown = ConfigGenerator.generateTechStackMarkdown(mockConfig);

      const frontendIndex = markdown.indexOf('**Frontend**');
      const backendIndex = markdown.indexOf('**Backend**');
      const databaseIndex = markdown.indexOf('**Database**');
      const testingIndex = markdown.indexOf('**Testing**');
      const deploymentIndex = markdown.indexOf('**Deployment**');

      expect(frontendIndex).toBeLessThan(backendIndex);
      expect(backendIndex).toBeLessThan(databaseIndex);
      expect(databaseIndex).toBeLessThan(testingIndex);
      expect(testingIndex).toBeLessThan(deploymentIndex);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty tech stack sections', () => {
      const emptyConfig: AgentWeaverConfig = {
        project: {
          name: 'empty-project',
          type: 'library',
        },
        techStack: {
          mode: 'flexible',
          frontend: {},
          backend: {},
          database: {},
          testing: {},
          deployment: {},
        },
      };

      const markdown = ConfigGenerator.generateTechStackMarkdown(emptyConfig);

      expect(markdown).toContain('# Tech Stack Overview');
      expect(markdown).toContain('## Stack Mode');
      expect(markdown).not.toContain('undefined');
      expect(markdown).not.toContain('null');
    });

    it('should handle very long technology names', () => {
      mockConfig.techStack.frontend.framework = 'a-very-long-framework-name-that-might-break-table-formatting';

      const markdown = ConfigGenerator.generateTechStackMarkdown(mockConfig);

      expect(markdown).toContain('a-very-long-framework-name-that-might-break-table-formatting');
    });

    it('should handle unicode characters', () => {
      mockConfig.project.name = 'Test Project 🚀';
      mockConfig.techStack.frontend.framework = 'React ⚛️';

      const markdown = ConfigGenerator.generateTechStackMarkdown(mockConfig);

      expect(markdown).toContain('React ⚛️');
    });
  });
});
