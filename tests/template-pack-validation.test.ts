import { describe, it, expect, beforeAll } from '@jest/globals';
import path from 'path';
import { fileURLToPath } from 'url';
import { TemplatePackValidator } from '../src/lib/template-pack-validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Template Pack Validation', () => {
  let validator: TemplatePackValidator;
  const templatesDir = path.join(__dirname, '..', 'src', 'templates', 'skills', 'api-pagination', 'templates');

  beforeAll(() => {
    validator = new TemplatePackValidator();
  });

  describe('Express TypeScript Template Pack', () => {
    it('should validate express-typescript pack successfully', async () => {
      const packPath = path.join(templatesDir, 'express-typescript');
      const result = await validator.validateTemplatePack(packPath);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.packName).toBe('express-typescript-pagination');
    });

    it('should have all required manifest fields', async () => {
      const packPath = path.join(templatesDir, 'express-typescript');
      const result = await validator.validateTemplatePack(packPath);

      expect(result.errors.filter((e) => e.field === 'name')).toHaveLength(0);
      expect(result.errors.filter((e) => e.field === 'version')).toHaveLength(0);
      expect(result.errors.filter((e) => e.field === 'applicability')).toHaveLength(0);
    });

    it('should have all source files present', async () => {
      const packPath = path.join(templatesDir, 'express-typescript');
      const result = await validator.validateTemplatePack(packPath);

      const fileErrors = result.errors.filter((e) => e.field.startsWith('files['));
      expect(fileErrors).toHaveLength(0);
    });
  });

  describe('FastAPI Template Pack', () => {
    it('should validate fastapi pack successfully', async () => {
      const packPath = path.join(templatesDir, 'fastapi');
      const result = await validator.validateTemplatePack(packPath);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.packName).toBe('fastapi-pagination');
    });
  });

  describe('Spring Boot Template Pack', () => {
    it('should validate spring-boot pack successfully', async () => {
      const packPath = path.join(templatesDir, 'spring-boot');
      const result = await validator.validateTemplatePack(packPath);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.packName).toBe('spring-boot-pagination');
    });
  });

  describe('ASP.NET Core Template Pack', () => {
    it('should validate aspnet-core pack successfully', async () => {
      const packPath = path.join(templatesDir, 'aspnet-core');
      const result = await validator.validateTemplatePack(packPath);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.packName).toBe('aspnet-core-pagination');
    });
  });

  describe('Gin Template Pack', () => {
    it('should validate gin pack successfully', async () => {
      const packPath = path.join(templatesDir, 'gin');
      const result = await validator.validateTemplatePack(packPath);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.packName).toBe('gin-pagination');
    });
  });

  describe('Rails Template Pack', () => {
    it('should validate rails pack successfully', async () => {
      const packPath = path.join(templatesDir, 'rails');
      const result = await validator.validateTemplatePack(packPath);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.packName).toBe('rails-pagination');
    });
  });

  describe('Laravel Template Pack', () => {
    it('should validate laravel pack successfully', async () => {
      const packPath = path.join(templatesDir, 'laravel');
      const result = await validator.validateTemplatePack(packPath);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.packName).toBe('laravel-pagination');
    });
  });

  describe('All API Pagination Packs', () => {
    it('should validate all template packs successfully', async () => {
      const skillPath = path.join(__dirname, '..', 'src', 'templates', 'skills', 'api-pagination');
      const results = await validator.validateAllTemplatePacks(skillPath);

      // Should find 7 template packs
      expect(results.length).toBeGreaterThanOrEqual(7);

      // All should be valid
      const invalidPacks = results.filter((r) => !r.valid);
      if (invalidPacks.length > 0) {
        console.error('Invalid packs:', invalidPacks);
      }
      expect(invalidPacks).toHaveLength(0);

      // Check that all expected packs are present
      const packNames = results.map((r) => r.packName);
      expect(packNames).toContain('express-typescript-pagination');
      expect(packNames).toContain('fastapi-pagination');
      expect(packNames).toContain('spring-boot-pagination');
      expect(packNames).toContain('aspnet-core-pagination');
      expect(packNames).toContain('gin-pagination');
      expect(packNames).toContain('rails-pagination');
      expect(packNames).toContain('laravel-pagination');
    });
  });

  describe('Variable Validation', () => {
    it('should detect undefined variables used in templates', async () => {
      // This would test a pack with an undefined variable reference
      // For now, we test that all existing packs don't have this issue
      const skillPath = path.join(__dirname, '..', 'src', 'templates', 'skills', 'api-pagination');
      const results = await validator.validateAllTemplatePacks(skillPath);

      results.forEach((result) => {
        const undefinedVarErrors = result.errors.filter(
          (e) => e.message.includes('not defined in variables')
        );
        expect(undefinedVarErrors).toHaveLength(0);
      });
    });
  });

  describe('File References', () => {
    it('should detect missing source files', async () => {
      const skillPath = path.join(__dirname, '..', 'src', 'templates', 'skills', 'api-pagination');
      const results = await validator.validateAllTemplatePacks(skillPath);

      results.forEach((result) => {
        const missingFileErrors = result.errors.filter(
          (e) => e.message.includes('does not exist')
        );
        expect(missingFileErrors).toHaveLength(0);
      });
    });
  });
});
