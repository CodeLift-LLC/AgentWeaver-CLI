import chalk from 'chalk';
import { StackInstaller } from '../../lib/stack-installer.js';

export async function templatesCommand() {
  console.log(chalk.cyan.bold('\n📦 Available Tech Stack Templates\n'));

  try {
    const installer = new StackInstaller();
    const templates = await installer.listTemplates();

    if (templates.length === 0) {
      console.log(chalk.yellow('No templates found.'));
      return;
    }

    templates.forEach((template, idx) => {
      const tech = template.techStack.backend?.framework || template.techStack.frontend?.framework;
      const language =
        template.techStack.backend?.language || template.techStack.frontend?.language;

      console.log(chalk.bold(`${idx + 1}. ${template.name}`));
      console.log(chalk.gray(`   ID: ${template.id}`));
      console.log(chalk.gray(`   ${template.description}`));
      console.log('');
      console.log(chalk.cyan('   Tech Stack:'));
      console.log(chalk.gray(`     Framework: ${tech}`));
      console.log(chalk.gray(`     Language: ${language}`));
      console.log(chalk.gray(`     Database: ${template.techStack.database?.primary}`));
      console.log(chalk.gray(`     ORM: ${template.techStack.database?.orm}`));
      console.log(
        chalk.gray(
          `     Package Manager: ${template.techStack.packageManager?.node || template.techStack.packageManager?.python}`
        )
      );
      console.log('');
      console.log(chalk.cyan('   Features:'));

      const defaultFeatures = Object.entries(template.features)
        .filter(([_, enabled]) => enabled)
        .map(([name]) => name);
      const optionalFeatures = Object.entries(template.features)
        .filter(([_, enabled]) => !enabled)
        .map(([name]) => name);

      if (defaultFeatures.length > 0) {
        console.log(chalk.green(`     ✓ Default: ${defaultFeatures.join(', ')}`));
      }
      if (optionalFeatures.length > 0) {
        console.log(chalk.gray(`     ⚙ Optional: ${optionalFeatures.join(', ')}`));
      }

      console.log('');
      console.log(chalk.cyan('   Details:'));
      console.log(chalk.gray(`     Complexity: ${template.complexity}`));
      console.log(chalk.gray(`     Architecture: ${template.architecture}`));
      console.log(chalk.gray(`     Files: ${template.files.length}`));
      console.log(chalk.gray(`     Docker Services: ${template.dockerServices.length}`));
      console.log('');
      console.log(chalk.white('   Usage:'));
      console.log(chalk.gray(`     agentweaver init --template ${template.id}`));
      console.log('');
      console.log(chalk.dim('   ─────────────────────────────────────────'));
      console.log('');
    });

    console.log(chalk.cyan('💡 Tip:'));
    console.log(chalk.white('  Run `agentweaver init` for interactive template selection'));
    console.log(chalk.white('  See TEMPLATES.md for detailed documentation\n'));
  } catch (error) {
    console.error(chalk.red('Error listing templates:'), (error as Error).message);
    process.exit(1);
  }
}
