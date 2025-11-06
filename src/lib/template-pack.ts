/**
 * Template Pack System for Multi-Framework Skill Support
 *
 * Enables skills to provide different implementations for different tech stacks.
 * Each skill can have multiple template packs, each targeting a specific framework/language combination.
 */

export interface TemplatePackManifest {
  /** Unique identifier for this template pack */
  name: string;

  /** Version of this template pack */
  version: string;

  /** Human-readable description */
  description: string;

  /** Author information */
  author?: string;

  /** Applicability rules - when should this template pack be used? */
  applicability: ApplicabilityRules;

  /** Files to be copied/generated */
  files: TemplateFile[];

  /** Variables that can be used in templates */
  variables?: Record<string, VariableDefinition>;

  /** Instructions for the user after installation */
  instructions?: string[];

  /** Links to relevant documentation */
  references?: string[];

  /** Required dependencies (for validation) */
  dependencies?: DependencyRequirement;

  /** Tags for categorization and search */
  tags?: string[];
}

export interface ApplicabilityRules {
  /** Required programming language */
  language: string;

  /** Required framework(s) - can match any if array */
  framework?: string | string[];

  /** Minimum version requirement (semver) */
  minVersion?: string;

  /** Maximum version requirement (semver) */
  maxVersion?: string;

  /** Required dependencies (must be present in project) */
  dependencies?: {
    required?: string[];
    optional?: string[];
  };

  /** Architecture requirements */
  architecture?: {
    type?: ('monolith' | 'microservices' | 'monorepo' | 'web-fullstack' | 'cli-tool' | 'desktop-app' | 'mobile-app' | 'library')[];
    style?: 'monoglot' | 'polyglot';
  };

  /** Custom matcher function name (for advanced matching) */
  customMatcher?: string;
}

export interface TemplateFile {
  /** Source file path (relative to template pack directory) */
  source: string;

  /** Target file path (can use variables like {{packagePath}}) */
  target: string;

  /** Description of what this file does */
  description: string;

  /** File type for syntax highlighting hints */
  type?: 'code' | 'config' | 'documentation' | 'test';

  /** Whether to merge with existing file or overwrite */
  strategy?: 'overwrite' | 'merge' | 'skip-if-exists';

  /** Template engine to use */
  templateEngine?: 'handlebars' | 'ejs' | 'plain';
}

export interface VariableDefinition {
  /** Description of this variable */
  description: string;

  /** Whether this variable is required */
  required: boolean;

  /** Default value (can be a template string) */
  default?: string;

  /** Validation regex */
  pattern?: string;

  /** Type of the variable */
  type?: 'string' | 'number' | 'boolean' | 'path';
}

export interface DependencyRequirement {
  /** Required packages */
  required?: string[];

  /** Optional packages (improves functionality) */
  optional?: string[];

  /** Conflicting packages (should not be present) */
  conflicts?: string[];
}

/**
 * Template Pack with loaded content
 */
export interface LoadedTemplatePack {
  manifest: TemplatePackManifest;
  packPath: string;
  skillName: string;
}

/**
 * Match result with scoring
 */
export interface TemplatePackMatch {
  pack: LoadedTemplatePack;
  score: number;
  reasons: MatchReason[];
}

export interface MatchReason {
  factor: string;
  score: number;
  description: string;
}

/**
 * Context for template resolution
 */
export interface ResolutionContext {
  /** Detected tech stack information */
  techStack: {
    language: string;
    framework?: string;
    version?: string;
    buildTool?: string;
    dependencies?: string[];
  };

  /** User preferences (can override detection) */
  preferences?: {
    preferredLanguage?: string;
    preferredFramework?: string;
    preferredStyle?: string;
  };

  /** Project metadata */
  project?: {
    name?: string;
    path?: string;
    architecture?: string;
  };
}

/**
 * Template pack scoring weights
 */
export const SCORING_WEIGHTS = {
  EXACT_LANGUAGE_MATCH: 0.4,
  EXACT_FRAMEWORK_MATCH: 0.3,
  VERSION_COMPATIBILITY: 0.15,
  USER_PREFERENCE: 0.1,
  DEPENDENCY_MATCH: 0.05,
} as const;

/**
 * Minimum score threshold for considering a template pack
 */
export const MIN_MATCH_SCORE = 0.5;
