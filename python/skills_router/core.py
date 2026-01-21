"""
Core functionality for skills-router
"""

import os
import shutil
import json
from pathlib import Path
from typing import Dict, List, Optional
import git


class SkillManager:
    """Manages skill installation, listing, and removal"""

    def __init__(self):
        # Get home directory
        self.home_dir = Path.home()

        # Define CLI paths
        self.cli_paths = {
            'claude': self.home_dir / '.claude' / 'skills',
            'codex': self.home_dir / '.codex' / 'skills',
            'gemini': self.home_dir / '.gemini' / 'skills',
        }

        # Temporary directory for clones
        self.temp_dir = Path('/tmp') / 'skills-router'

    def _ensure_cli_dir(self, cli_type: str) -> Path:
        """Ensure the CLI skill directory exists"""
        cli_path = self.cli_paths.get(cli_type)
        if not cli_path:
            raise ValueError(f"Unknown CLI type: {cli_type}")

        cli_path.mkdir(parents=True, exist_ok=True)
        return cli_path

    def _is_skill_directory(self, dir_path: Path) -> bool:
        """Check if a directory is a valid skill directory"""
        return (dir_path / 'SKILL.md').exists()

    def _get_skill_name(self, skill_path: Path) -> str:
        """Extract skill name from path"""
        return skill_path.name

    def install_skill(self, source_path: str, target_cli: str, skill_name: Optional[str] = None) -> Dict:
        """
        Install a skill to the target CLI

        Args:
            source_path: Path to the source skill directory
            target_cli: Target CLI type (claude, codex, gemini)
            skill_name: Optional name for the skill (defaults to directory name)

        Returns:
            Dict with success status and message
        """
        try:
            source = Path(source_path)
            if not source.exists():
                return {'success': False, 'error': f'Source path does not exist: {source_path}'}

            # Verify it's a skill directory
            if not self._is_skill_directory(source):
                return {'success': False, 'error': 'Not a valid skill directory (missing SKILL.md)'}

            # Get skill name
            name = skill_name or self._get_skill_name(source)

            # Ensure target CLI directory exists
            target_dir = self._ensure_cli_dir(target_cli)
            target_path = target_dir / name

            # Check if skill already exists
            if target_path.exists():
                return {'success': False, 'error': f'Skill already exists: {name}'}

            # Copy skill directory
            shutil.copytree(source, target_path)

            return {
                'success': True,
                'message': f'Successfully installed skill "{name}" to {target_cli}',
                'path': str(target_path)
            }

        except Exception as e:
            return {'success': False, 'error': str(e)}

    def list_skills(self, cli_type: str) -> Dict:
        """
        List all installed skills for a CLI

        Args:
            cli_type: CLI type (claude, codex, gemini)

        Returns:
            Dict with success status and list of skills
        """
        try:
            cli_path = self.cli_paths.get(cli_type)
            if not cli_path:
                return {'success': False, 'error': f'Unknown CLI type: {cli_type}'}

            if not cli_path.exists():
                return {'success': True, 'skills': []}

            skills = []
            for item in cli_path.iterdir():
                if item.is_dir() and self._is_skill_directory(item):
                    skills.append({
                        'name': item.name,
                        'path': str(item)
                    })

            return {'success': True, 'skills': skills}

        except Exception as e:
            return {'success': False, 'error': str(e)}

    def remove_skill(self, cli_type: str, skill_name: str) -> Dict:
        """
        Remove a skill from a CLI

        Args:
            cli_type: CLI type (claude, codex, gemini)
            skill_name: Name of the skill to remove

        Returns:
            Dict with success status and message
        """
        try:
            cli_path = self.cli_paths.get(cli_type)
            if not cli_path:
                return {'success': False, 'error': f'Unknown CLI type: {cli_type}'}

            skill_path = cli_path / skill_name
            if not skill_path.exists():
                return {'success': False, 'error': f'Skill not found: {skill_name}'}

            # Remove skill directory
            shutil.rmtree(skill_path)

            return {
                'success': True,
                'message': f'Successfully removed skill "{skill_name}" from {cli_type}'
            }

        except Exception as e:
            return {'success': False, 'error': str(e)}

    def clone_repo(self, repo_url: str, target_dir: Optional[str] = None) -> Dict:
        """
        Clone a GitHub repository

        Args:
            repo_url: URL of the repository
            target_dir: Optional target directory (defaults to temp dir)

        Returns:
            Dict with success status and clone path
        """
        try:
            if target_dir is None:
                # Use repo name as directory name
                repo_name = repo_url.rstrip('/').split('/')[-1]
                if repo_name.endswith('.git'):
                    repo_name = repo_name[:-4]
                target_dir = str(self.temp_dir / repo_name)

            target = Path(target_dir)

            # Remove existing directory if it exists
            if target.exists():
                shutil.rmtree(target)

            # Clone with depth 1 for speed
            git.Repo.clone_from(repo_url, target, depth=1)

            return {
                'success': True,
                'path': str(target)
            }

        except Exception as e:
            return {'success': False, 'error': str(e)}


def main():
    """Main entry point for the CLI"""
    import sys

    if len(sys.argv) < 2:
        print(json.dumps({'success': False, 'error': 'No action specified'}))
        sys.exit(1)

    action = sys.argv[1]
    params = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}

    manager = SkillManager()

    result = {'success': False}

    if action == 'install':
        result = manager.install_skill(
            params.get('sourcePath', ''),
            params.get('targetCli', ''),
            params.get('skillName')
        )
    elif action == 'list':
        result = manager.list_skills(params.get('cliType', ''))
    elif action == 'remove':
        result = manager.remove_skill(
            params.get('cliType', ''),
            params.get('skillName', '')
        )
    elif action == 'clone':
        result = manager.clone_repo(
            params.get('repoUrl', ''),
            params.get('targetDir')
        )
    else:
        result = {'success': False, 'error': f'Unknown action: {action}'}

    print(json.dumps(result), flush=True)


if __name__ == '__main__':
    main()
