from setuptools import setup, find_packages

setup(
    name='skills-router',
    version='0.1.0',
    description='A unified CLI tool to manage skills for different AI CLI tools',
    author='skills-router',
    license='MIT',
    packages=find_packages(),
    install_requires=[
        'GitPython>=3.1.0',
        'requests>=2.31.0',
    ],
    entry_points={
        'console_scripts': [
            'skills-router=skills_router.cli:main',
        ],
    },
    python_requires='>=3.8',
)
