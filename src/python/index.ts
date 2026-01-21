import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs-extra';

// Resolve path relative to package root
const PACKAGE_ROOT = path.join(__dirname, '..', '..');
const PYTHON_SCRIPT_PATH = path.join(PACKAGE_ROOT, 'python', 'skills_router', 'core.py');

export interface PythonResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function runPythonScript<T = any>(
  action: string,
  params: any = {}
): Promise<PythonResponse<T>> {
  return new Promise((resolve) => {
    const scriptPath = path.resolve(PYTHON_SCRIPT_PATH);

    if (!fs.existsSync(scriptPath)) {
      resolve({
        success: false,
        error: `Python script not found at: ${scriptPath}`,
      });
      return;
    }

    const python = spawn('python3', [scriptPath, action, JSON.stringify(params)], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    python.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    python.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    python.on('close', (code) => {
      try {
        const response = JSON.parse(stdout);
        resolve(response);
      } catch (e) {
        resolve({
          success: false,
          error: `Failed to parse Python output. stdout: "${stdout}", stderr: "${stderr}"`,
        });
      }
    });

    python.on('error', (err) => {
      resolve({
        success: false,
        error: `Python process error: ${err.message}`,
      });
    });
  });
}

export async function installSkill(params: {
  sourcePath: string;
  targetCli: string;
  skillName: string;
}): Promise<PythonResponse> {
  return runPythonScript('install', params);
}

export async function listSkills(params: {
  cliType: string;
}): Promise<PythonResponse<string[]>> {
  return runPythonScript('list', params);
}

export async function removeSkill(params: {
  cliType: string;
  skillName: string;
}): Promise<PythonResponse> {
  return runPythonScript('remove', params);
}
