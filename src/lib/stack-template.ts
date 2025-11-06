/**
 * Stack Template System - Types and Interfaces
 *
 * Defines the structure for pre-configured tech stack templates
 * that users can select during `agentweaver init`.
 */

/**
 * Template complexity levels
 */
export type TemplateComplexity = 'beginner' | 'intermediate' | 'advanced';

/**
 * Template architecture patterns
 */
export type ArchitecturePattern = 'vertical-slice' | 'clean' | 'layered' | 'hexagonal';

/**
 * Customizable features that can be included/excluded
 */
export interface TemplateFeatures {
  authentication: boolean;
  aiIntegration: boolean;
  vectorSearch: boolean;
  payments: boolean;
  email: boolean;
  fileStorage: boolean;
  realtime: boolean;
  analytics: boolean;
}

/**
 * Technology stack definition
 */
export interface TechStack {
  frontend?: {
    framework?: string;
    version?: string;
    language?: string;
    styling?: string;
    uiLibrary?: string;
    stateManagement?: string;
  };
  backend?: {
    framework?: string;
    version?: string;
    language?: string;
    runtime?: string;
    apiStyle?: string;
  };
  database?: {
    primary?: string;
    version?: string;
    orm?: string;
    migrations?: string;
    vector?: string;
  };
  testing?: {
    unit?: string;
    integration?: string;
    e2e?: string;
    component?: string;
  };
  deployment?: {
    containerization?: string;
    ci?: string;
    platform?: string;
  };
  ai?: {
    provider?: string;
    sdk?: string;
    observability?: string;
  };
  packageManager?: {
    node?: string;
    python?: string;
  };
}

/**
 * Template file definition
 */
export interface TemplateFile {
  source: string; // Path relative to template directory
  destination: string; // Path relative to project root
  type: 'copy' | 'template'; // 'copy' = direct copy, 'template' = process variables
  required: boolean; // Whether this file is always needed
  features?: string[]; // Features that require this file (e.g., ['payments'])
}

/**
 * Docker service definition
 */
export interface DockerService {
  name: string;
  image?: string;
  build?: string;
  ports?: string[];
  environment?: Record<string, string>;
  volumes?: string[];
  dependsOn?: string[];
  required: boolean;
  features?: string[]; // Features that require this service
}

/**
 * Main stack template definition
 */
export interface StackTemplate {
  id: string;
  name: string;
  description: string;
  complexity: TemplateComplexity;
  architecture: ArchitecturePattern;
  tags: string[];

  /**
   * Prerequisites for using this template
   */
  requirements: {
    docker: boolean;
    dockerCompose?: string; // Minimum version
    node?: string; // Minimum Node.js version
    python?: string; // Minimum Python version
    pnpm?: boolean;
    uv?: boolean;
  };

  /**
   * Technology stack definition
   */
  techStack: TechStack;

  /**
   * Available customizable features
   */
  features: TemplateFeatures;

  /**
   * Files to generate/copy
   */
  files: TemplateFile[];

  /**
   * Docker services configuration
   */
  dockerServices: DockerService[];

  /**
   * Setup commands to run after installation
   */
  setupCommands?: {
    description: string;
    command: string;
    workingDir?: string;
  }[];

  /**
   * Metadata
   */
  metadata: {
    author?: string;
    version: string;
    lastUpdated: string;
    documentationUrl?: string;
  };
}

/**
 * Template installation context
 */
export interface StackContext {
  projectName: string;
  projectPath: string;
  selectedFeatures: Partial<TemplateFeatures>;
  environmentVariables: Record<string, string>;
  customValues?: Record<string, string>;
}

/**
 * Installation result
 */
export interface InstallResult {
  success: boolean;
  template: StackTemplate;
  filesCreated: string[];
  servicesConfigured: string[];
  errors: string[];
  warnings: string[];
  nextSteps: string[];
}

/**
 * Validation result for prerequisites
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  missingRequirements: string[];
}
