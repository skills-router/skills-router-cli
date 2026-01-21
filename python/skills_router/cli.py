"""
CLI entry point for skills-router (standalone Python version)
"""

import argparse
import json
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from skills_router.core import SkillManager


def add_command(args):
    """Add a skill from GitHub"""
    manager = SkillManager()

    # Parse GitHub URL
    # For now, just implement basic clone and install
    print(f"Adding skill from: {args.url}")
    print(f"Target CLI: {args.cli}")


def search_command(args):
    """Search for skills"""
    import requests

    url = 'https://www.skills-router.com/api/skills'
    params = {
        'page': 1,
        'pageSize': 12,
        'filter': args.keyword
    }

    try:
        response = requests.get(url, params=params)
        data = response.json()

        print(f"\nFound {len(data.get('results', []))} skills matching '{args.keyword}':\n")
        for skill in data.get('results', []):
            print(f"  - {skill.get('name')}")
            print(f"    {skill.get('description')}")
            print(f"    Repository: {skill.get('repository')}")
            print()

    except Exception as e:
        print(f"Error searching skills: {e}")


def list_command(args):
    """List installed skills"""
    manager = SkillManager()

    result = manager.list_skills(args.cli)

    if not result['success']:
        print(f"Error: {result['error']}")
        return

    skills = result.get('skills', [])
    print(f"\nInstalled skills for {args.cli}:\n")
    if not skills:
        print("  No skills installed.")
    else:
        for skill in skills:
            print(f"  - {skill['name']}")
            print(f"    Path: {skill['path']}")


def remove_command(args):
    """Remove a skill"""
    manager = SkillManager()

    result = manager.remove_skill(args.cli, args.name)

    if result['success']:
        print(result['message'])
    else:
        print(f"Error: {result['error']}")


def main():
    parser = argparse.ArgumentParser(
        description='Skills Router - A unified CLI tool to manage skills for different AI CLI tools'
    )
    parser.add_argument('--version', action='version', version='skills-router 0.1.0')

    subparsers = parser.add_subparsers(dest='command', help='Available commands')

    # Add command
    add_parser = subparsers.add_parser('add', help='Add a skill from GitHub')
    add_parser.add_argument('url', help='GitHub URL or owner/repo/path')
    add_parser.add_argument('--cli', help='Target CLI (claude, codex, gemini)', default='claude')
    add_parser.set_defaults(func=add_command)

    # Search command
    search_parser = subparsers.add_parser('search', help='Search for skills')
    search_parser.add_argument('keyword', help='Search keyword')
    search_parser.set_defaults(func=search_command)

    # List command
    list_parser = subparsers.add_parser('list', help='List installed skills')
    list_parser.add_argument('--cli', help='CLI type (claude, codex, gemini)', default='claude')
    list_parser.set_defaults(func=list_command)

    # Remove command
    remove_parser = subparsers.add_parser('remove', help='Remove a skill')
    remove_parser.add_argument('name', help='Skill name to remove')
    remove_parser.add_argument('--cli', help='CLI type (claude, codex, gemini)', default='claude')
    remove_parser.set_defaults(func=remove_command)

    args = parser.parse_args()

    if args.command:
        args.func(args)
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
