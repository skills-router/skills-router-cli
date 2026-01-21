import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs-extra';
const execAsync = promisify(exec);

export async function shallowCloneRepo(
  repoUrl: string,
  targetDir: string
): Promise<string> {
  const { stdout, stderr } = await execAsync(
    `git clone --depth 1 ${repoUrl} ${targetDir}`
  );

  if (stderr) {
    console.error('Git clone stderr:', stderr);
  }

  return targetDir;
}

export function parseGitHubUrl(url: string): { owner: string; repo: string; branch: string; path: string; type: 'dir' | 'file' } {
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/]+)\/tree\/([^\/]+)\/(.+)/,
    /github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const [, owner, repo, branch, path] = match;
      return {
        owner,
        repo,
        branch,
        path,
        type: pattern.toString().includes('blob') ? 'file' : 'dir',
      };
    }
  }

  const simpleMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (simpleMatch) {
    return {
      owner: simpleMatch[1],
      repo: simpleMatch[2],
      branch: 'main',
      path: '',
      type: 'dir',
    };
  }

  throw new Error('Invalid GitHub URL format');
}

export async function getSkillsInDir(dirPath: string): Promise<string[]> {
  const skills: string[] = [];

  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const skillPath = path.join(dirPath, entry.name);
      const skillMPath = path.join(skillPath, 'SKILL.md');
      if (await fs.pathExists(skillMPath)) {
        skills.push(skillPath);
      } else {
        const subSkills = await getSkillsInDir(skillPath);
        skills.push(...subSkills);
      }
    }
  }

  return skills;
}

export async function findSkillDirectory(dirPath: string): Promise<string | null> {
  const skillMPath = path.join(dirPath, 'SKILL.md');
  if (await fs.pathExists(skillMPath)) {
    return dirPath;
  }

  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subDirPath = path.join(dirPath, entry.name);
      const found = await findSkillDirectory(subDirPath);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

export function getSkillName(path: string): string {
  return path.split('/').pop() || '';
}
