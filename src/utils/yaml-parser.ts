import matter from 'gray-matter';
import yaml from 'js-yaml';

/**
 * YAML frontmatter parser and validator for AgentWeaver CLI
 */

export class YamlParseError extends Error {
  constructor(
    message: string,
    public readonly filePath: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'YamlParseError';
  }
}

export interface AgentFrontmatter {
  name: string;
  description: string;
  tools?: string[];
  model?: 'sonnet' | 'opus' | 'haiku' | 'inherit';
  [key: string]: unknown;
}

export interface SkillFrontmatter {
  name: string;
  description: string;
  'allowed-tools'?: string[];
  tags?: string[];
  [key: string]: unknown;
}

export interface ParsedMarkdown<T> {
  frontmatter: T;
  content: string;
  raw: string;
}

/**
 * Parses markdown content with YAML frontmatter
 */
export function parseMarkdown<T = Record<string, unknown>>(
  content: string,
  filePath: string
): ParsedMarkdown<T> {
  try {
    const parsed = matter(content);

    return {
      frontmatter: parsed.data as T,
      content: parsed.content,
      raw: content,
    };
  } catch (error) {
    throw new YamlParseError(
      `Failed to parse YAML frontmatter in file: ${filePath}`,
      filePath,
      error as Error
    );
  }
}

/**
 * Validates agent frontmatter has required fields
 */
export function validateAgentFrontmatter(frontmatter: unknown, filePath: string): AgentFrontmatter {
  if (!frontmatter || typeof frontmatter !== 'object') {
    throw new YamlParseError('Frontmatter must be an object', filePath);
  }

  const fm = frontmatter as Record<string, unknown>;

  // Validate required fields
  if (!fm.name || typeof fm.name !== 'string' || fm.name.trim() === '') {
    throw new YamlParseError('Agent frontmatter must have a non-empty "name" field', filePath);
  }

  if (!fm.description || typeof fm.description !== 'string' || fm.description.trim() === '') {
    throw new YamlParseError(
      'Agent frontmatter must have a non-empty "description" field',
      filePath
    );
  }

  // Validate optional fields
  if (fm.tools !== undefined) {
    // Handle both string (comma-separated) and array formats
    if (typeof fm.tools === 'string') {
      // Convert comma-separated string to array
      fm.tools = fm.tools.split(',').map((tool) => tool.trim());
    } else if (!Array.isArray(fm.tools)) {
      throw new YamlParseError(
        'Agent frontmatter "tools" must be an array or comma-separated string',
        filePath
      );
    }

    // Type assertion after validation
    const tools = fm.tools as unknown[];
    if (!tools.every((tool: unknown) => typeof tool === 'string')) {
      throw new YamlParseError('Agent frontmatter "tools" must contain only strings', filePath);
    }
  }

  if (fm.model !== undefined) {
    const validModels = ['sonnet', 'opus', 'haiku', 'inherit'];
    if (!validModels.includes(fm.model as string)) {
      throw new YamlParseError(
        `Agent frontmatter "model" must be one of: ${validModels.join(', ')}`,
        filePath
      );
    }
  }

  return fm as AgentFrontmatter;
}

/**
 * Validates skill frontmatter has required fields
 */
export function validateSkillFrontmatter(frontmatter: unknown, filePath: string): SkillFrontmatter {
  if (!frontmatter || typeof frontmatter !== 'object') {
    throw new YamlParseError('Frontmatter must be an object', filePath);
  }

  const fm = frontmatter as Record<string, unknown>;

  // Validate required fields
  if (!fm.name || typeof fm.name !== 'string' || fm.name.trim() === '') {
    throw new YamlParseError('Skill frontmatter must have a non-empty "name" field', filePath);
  }

  if (!fm.description || typeof fm.description !== 'string' || fm.description.trim() === '') {
    throw new YamlParseError(
      'Skill frontmatter must have a non-empty "description" field',
      filePath
    );
  }

  // Validate optional fields
  if (fm['allowed-tools'] !== undefined) {
    // Handle both string (comma-separated) and array formats
    if (typeof fm['allowed-tools'] === 'string') {
      fm['allowed-tools'] = (fm['allowed-tools'] as string).split(',').map((tool) => tool.trim());
    } else if (!Array.isArray(fm['allowed-tools'])) {
      throw new YamlParseError(
        'Skill frontmatter "allowed-tools" must be an array or comma-separated string',
        filePath
      );
    }

    const allowedTools = fm['allowed-tools'] as unknown[];
    if (!allowedTools.every((tool: unknown) => typeof tool === 'string')) {
      throw new YamlParseError(
        'Skill frontmatter "allowed-tools" must contain only strings',
        filePath
      );
    }
  }

  if (fm.tags !== undefined) {
    // Handle both string (comma-separated) and array formats
    if (typeof fm.tags === 'string') {
      fm.tags = (fm.tags as string).split(',').map((tag) => tag.trim());
    } else if (!Array.isArray(fm.tags)) {
      throw new YamlParseError(
        'Skill frontmatter "tags" must be an array or comma-separated string',
        filePath
      );
    }

    const tags = fm.tags as unknown[];
    if (!tags.every((tag: unknown) => typeof tag === 'string')) {
      throw new YamlParseError('Skill frontmatter "tags" must contain only strings', filePath);
    }
  }

  return fm as SkillFrontmatter;
}

/**
 * Checks if agent description contains proactive trigger phrase
 */
export function hasProactiveTrigger(description: string): boolean {
  const trigger = 'Use PROACTIVELY';
  return description.includes(trigger);
}

/**
 * Parses and validates an agent file
 */
export function parseAgentFile(
  content: string,
  filePath: string
): ParsedMarkdown<AgentFrontmatter> {
  const parsed = parseMarkdown<AgentFrontmatter>(content, filePath);
  const validatedFrontmatter = validateAgentFrontmatter(parsed.frontmatter, filePath);

  return {
    frontmatter: validatedFrontmatter,
    content: parsed.content,
    raw: parsed.raw,
  };
}

/**
 * Parses and validates a skill file
 */
export function parseSkillFile(
  content: string,
  filePath: string
): ParsedMarkdown<SkillFrontmatter> {
  const parsed = parseMarkdown<SkillFrontmatter>(content, filePath);
  const validatedFrontmatter = validateSkillFrontmatter(parsed.frontmatter, filePath);

  return {
    frontmatter: validatedFrontmatter,
    content: parsed.content,
    raw: parsed.raw,
  };
}

/**
 * Serializes an object to YAML string
 */
export function serializeToYaml(data: unknown): string {
  try {
    return yaml.dump(data, {
      indent: 2,
      lineWidth: 100,
      noRefs: true,
    });
  } catch (error) {
    throw new Error(`Failed to serialize data to YAML: ${(error as Error).message}`);
  }
}

/**
 * Parses a YAML string to an object
 */
export function parseYaml<T = unknown>(yamlString: string): T {
  try {
    return yaml.load(yamlString) as T;
  } catch (error) {
    throw new Error(`Failed to parse YAML: ${(error as Error).message}`);
  }
}

/**
 * Creates markdown content with YAML frontmatter
 */
export function createMarkdownWithFrontmatter(
  frontmatter: Record<string, unknown>,
  content: string
): string {
  const yamlContent = serializeToYaml(frontmatter).trim();
  return `---\n${yamlContent}\n---\n\n${content}`;
}
