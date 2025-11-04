import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { TemplatePackValidator } from '../../lib/template-pack-validator.js';
import { getTemplatesDirectory } from '../../utils/file-operations.js';

interface ValidateOptions {
  skill?: string;
  pack?: string;
  verbose?: boolean;
}

/**
 * Validate template packs for correctness
 */
export async function validateCommand(options: ValidateOptions) {
  console.log(chalk.cyan.bold('\n🔍 AgentWeaver Template Pack Validator\n'));

  const templatesDir = getTemplatesDirectory();
  const validator = new TemplatePackValidator();

  try {
    if (options.pack) {
      // Validate a specific template pack
      await validateSpecificPack(validator, options.pack, options.verbose);
    } else if (options.skill) {
      // Validate all template packs for a specific skill
      await validateSkillPacks(validator, templatesDir, options.skill, options.verbose);
    } else {
      // Validate all template packs
      await validateAllPacks(validator, templatesDir, options.verbose);
    }
  } catch (error) {
    console.error(chalk.red('\n❌ Validation failed:'), (error as Error).message);
    process.exit(1);
  }
}

/**
 * Validate a specific template pack
 */
async function validateSpecificPack(
  validator: TemplatePackValidator,
  packPath: string,
  verbose: boolean = false
) {
  const spinner = ora(`Validating template pack: ${packPath}`).start();

  const result = await validator.validateTemplatePack(packPath);

  if (result.valid) {
    spinner.succeed(chalk.green(`✅ ${result.packName} is valid`));
  } else {
    spinner.fail(chalk.red(`❌ ${result.packName} has errors`));
  }

  displayValidationResult(result, verbose);

  if (!result.valid) {
    process.exit(1);
  }
}

/**
 * Validate all template packs for a skill
 */
async function validateSkillPacks(
  validator: TemplatePackValidator,
  templatesDir: string,
  skillName: string,
  verbose: boolean = false
) {
  const skillPath = path.join(templatesDir, 'skills', skillName);
  const spinner = ora(`Validating template packs for skill: ${skillName}`).start();

  const results = await validator.validateAllTemplatePacks(skillPath);

  if (results.length === 0) {
    spinner.warn(chalk.yellow(`No template packs found for skill: ${skillName}`));
    return;
  }

  spinner.stop();

  const validCount = results.filter((r) => r.valid).length;
  const invalidCount = results.length - validCount;

  console.log(chalk.cyan(`\nFound ${results.length} template pack(s) for ${skillName}:\n`));

  results.forEach((result) => {
    displayValidationResult(result, verbose);
  });

  // Summary
  console.log(chalk.cyan('\n📊 Summary:\n'));
  console.log(chalk.green(`  ✅ Valid: ${validCount}`));
  if (invalidCount > 0) {
    console.log(chalk.red(`  ❌ Invalid: ${invalidCount}`));
  }

  if (invalidCount > 0) {
    process.exit(1);
  }
}

/**
 * Validate all template packs across all skills
 */
async function validateAllPacks(
  validator: TemplatePackValidator,
  templatesDir: string,
  verbose: boolean = false
) {
  const spinner = ora('Scanning for template packs...').start();

  const skillsDir = path.join(templatesDir, 'skills');
  const { listDirectories } = await import('../../utils/file-operations.js');
  const skills = await listDirectories(skillsDir);

  spinner.stop();

  console.log(chalk.cyan(`Found ${skills.length} skill(s) to validate\n`));

  let totalPacks = 0;
  let totalValid = 0;
  let totalInvalid = 0;

  for (const skill of skills) {
    const skillPath = path.join(skillsDir, skill);
    const results = await validator.validateAllTemplatePacks(skillPath);

    if (results.length === 0) continue;

    totalPacks += results.length;
    const validCount = results.filter((r) => r.valid).length;
    totalValid += validCount;
    totalInvalid += results.length - validCount;

    console.log(chalk.bold(`\n📦 ${skill}:`));
    results.forEach((result) => {
      displayValidationResult(result, verbose);
    });
  }

  // Final summary
  console.log(chalk.cyan.bold('\n📊 Final Summary:\n'));
  console.log(chalk.gray(`  Total Template Packs: ${totalPacks}`));
  console.log(chalk.green(`  ✅ Valid: ${totalValid}`));
  if (totalInvalid > 0) {
    console.log(chalk.red(`  ❌ Invalid: ${totalInvalid}`));
  }

  if (totalInvalid > 0) {
    console.log(chalk.yellow('\n⚠️  Please fix validation errors before using these template packs\n'));
    process.exit(1);
  } else {
    console.log(chalk.green('\n🎉 All template packs are valid!\n'));
  }
}

/**
 * Display validation result for a single pack
 */
function displayValidationResult(result: any, verbose: boolean = false) {
  const icon = result.valid ? '✅' : '❌';
  const color = result.valid ? chalk.green : chalk.red;

  console.log(color(`  ${icon} ${result.packName}`));

  // Always show errors
  if (result.errors.length > 0) {
    console.log(chalk.red('    Errors:'));
    result.errors.forEach((error: any) => {
      const severity = error.severity === 'critical' ? '🔴' : error.severity === 'high' ? '🟠' : '🟡';
      console.log(chalk.red(`      ${severity} ${error.field}: ${error.message}`));
    });
  }

  // Show warnings only in verbose mode or if there are errors
  if ((verbose || result.errors.length > 0) && result.warnings.length > 0) {
    console.log(chalk.yellow('    Warnings:'));
    result.warnings.forEach((warning: any) => {
      console.log(chalk.yellow(`      ⚠️  ${warning.field}: ${warning.message}`));
    });
  }

  // Show success details in verbose mode
  if (verbose && result.valid) {
    console.log(chalk.gray(`    Path: ${result.packPath}`));
    if (result.warnings.length === 0) {
      console.log(chalk.gray('    No warnings'));
    }
  }
}
