# setup.py

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="sesame_ai",
    version="0.1.0",
    author="ijub",
    author_email="ijubgithub@gmail.com",
    description="Unofficial Python API wrapper for SesameAI",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/ijub/sesame-ai",
    packages=find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Libraries :: Python Modules",
    ],
    python_requires=">=3.6",
    install_requires=[
        "requests>=2.25.0",
        "websocket-client>=1.2.0",
        "numpy>=1.19.0",
        "PyAudio>=0.2.11",
    ],
    extras_require={
        "dev": [
            "pytest>=6.0.0",
            "black>=21.5b2",
            "flake8>=3.9.0",
        ],
    },
    keywords="sesame, ai, voice, api, wrapper, chatbot",
)