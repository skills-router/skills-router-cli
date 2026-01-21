export type CLIType = 'claude' | 'codex' | 'gemini';

export interface GitHubPath {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  type: 'dir' | 'file';
}

export interface SkillInfo {
  name: string;
  path: string;
  description?: string;
  repository: string;
}

export interface SkillSearchResult {
  id: string;
  name: string;
  description: string;
  repository: string;
  author: string;
  stars: number;
}

export interface CLIPaths {
  claude: string;
  codex: string;
  gemini: string;
}

export interface InstallOptions {
  cliTargets: CLIType[];
  skipConfirmation?: boolean;
}
