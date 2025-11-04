import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/**
 * File operation utilities for AgentWeaver CLI
 */

export class FileOperationError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly path: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'FileOperationError';
  }
}

/**
 * Validates that a path is safe and doesn't attempt directory traversal
 */
export function validatePath(targetPath: string): boolean {
  const normalized = path.normalize(targetPath);
  return !normalized.includes('..') && !path.isAbsolute(normalized);
}

/**
 * Ensures a directory exists, creating it if necessary
 */
export async function ensureDirectory(dirPath: string): Promise<void> {
  try {
    await fs.ensureDir(dirPath);
  } catch (error) {
    throw new FileOperationError(
      `Failed to create directory: ${dirPath}`,
      'ensureDirectory',
      dirPath,
      error as Error
    );
  }
}

/**
 * Copies a file from source to destination with validation
 */
export async function copyFile(src: string, dest: string): Promise<void> {
  try {
    // Ensure destination directory exists
    await ensureDirectory(path.dirname(dest));

    // Check if source exists
    const exists = await fs.pathExists(src);
    if (!exists) {
      throw new Error(`Source file does not exist: ${src}`);
    }

    // Copy the file
    await fs.copy(src, dest, { overwrite: false });
  } catch (error) {
    throw new FileOperationError(
      `Failed to copy file from ${src} to ${dest}`,
      'copyFile',
      dest,
      error as Error
    );
  }
}

/**
 * Copies a directory recursively from source to destination
 */
export async function copyDirectory(src: string, dest: string): Promise<void> {
  try {
    // Check if source exists
    const exists = await fs.pathExists(src);
    if (!exists) {
      throw new Error(`Source directory does not exist: ${src}`);
    }

    // Copy the directory
    await fs.copy(src, dest, {
      overwrite: false,
      errorOnExist: true,
    });
  } catch (error) {
    throw new FileOperationError(
      `Failed to copy directory from ${src} to ${dest}`,
      'copyDirectory',
      dest,
      error as Error
    );
  }
}

/**
 * Reads a file and returns its content as a string
 */
export async function readFile(filePath: string): Promise<string> {
  try {
    const exists = await fs.pathExists(filePath);
    if (!exists) {
      throw new Error(`File does not exist: ${filePath}`);
    }

    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    throw new FileOperationError(
      `Failed to read file: ${filePath}`,
      'readFile',
      filePath,
      error as Error
    );
  }
}

/**
 * Writes content to a file
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
  try {
    // Ensure directory exists
    await ensureDirectory(path.dirname(filePath));

    // Write the file
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error) {
    throw new FileOperationError(
      `Failed to write file: ${filePath}`,
      'writeFile',
      filePath,
      error as Error
    );
  }
}

/**
 * Checks if a file or directory exists
 */
export async function pathExists(targetPath: string): Promise<boolean> {
  try {
    return await fs.pathExists(targetPath);
  } catch (error) {
    return false;
  }
}

/**
 * Reads a JSON file and parses it
 */
export async function readJsonFile<T>(filePath: string): Promise<T> {
  try {
    const content = await readFile(filePath);
    return JSON.parse(content) as T;
  } catch (error) {
    throw new FileOperationError(
      `Failed to read and parse JSON file: ${filePath}`,
      'readJsonFile',
      filePath,
      error as Error
    );
  }
}

/**
 * Writes an object to a JSON file with formatting
 */
export async function writeJsonFile(
  filePath: string,
  data: unknown,
  pretty = true
): Promise<void> {
  try {
    const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    await writeFile(filePath, content);
  } catch (error) {
    throw new FileOperationError(
      `Failed to write JSON file: ${filePath}`,
      'writeJsonFile',
      filePath,
      error as Error
    );
  }
}

/**
 * Gets the root directory of the package (for accessing templates)
 */
export function getPackageRoot(): string {
  // In ESM, we need to use import.meta.url to get the current file path
  // This function will be called from compiled dist/ folder
  const currentFile = fileURLToPath(import.meta.url);
  const currentDir = dirname(currentFile);

  // From dist/utils/file-operations.js, go up to package root
  return path.resolve(currentDir, '..', '..');
}

/**
 * Gets the templates directory path
 */
export function getTemplatesDirectory(): string {
  // From dist/utils/file-operations.js, templates are in dist/templates
  // Get the directory of the current module
  const currentFile = fileURLToPath(import.meta.url);
  const currentDir = dirname(currentFile);

  // Templates are one level up from utils, then into templates
  const templatesPath = path.join(currentDir, '..', 'templates');

  return templatesPath;
}

/**
 * Lists all files in a directory (non-recursive)
 */
export async function listFiles(dirPath: string): Promise<string[]> {
  try {
    const exists = await fs.pathExists(dirPath);
    if (!exists) {
      return [];
    }

    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  } catch (error) {
    throw new FileOperationError(
      `Failed to list files in directory: ${dirPath}`,
      'listFiles',
      dirPath,
      error as Error
    );
  }
}

/**
 * Lists all subdirectories in a directory (non-recursive)
 */
export async function listDirectories(dirPath: string): Promise<string[]> {
  try {
    const exists = await fs.pathExists(dirPath);
    if (!exists) {
      return [];
    }

    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch (error) {
    throw new FileOperationError(
      `Failed to list directories in: ${dirPath}`,
      'listDirectories',
      dirPath,
      error as Error
    );
  }
}
