import os from 'os';
import path from 'path';

const CLI_PATHS: Record<string, string> = {
  claude: path.join(os.homedir(), '.claude', 'skills'),
  codex: path.join(os.homedir(), '.codex', 'skills'),
  gemini: path.join(os.homedir(), '.gemini', 'skills'),
};

export function getCliPath(cliType: string): string {
  return CLI_PATHS[cliType] || '';
}

export function getCliPaths() {
  return CLI_PATHS;
}

export function getTempDir(): string {
  return path.join(os.tmpdir(), 'skills-router');
}
