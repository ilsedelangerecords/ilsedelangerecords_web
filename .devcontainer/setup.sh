#!/bin/bash

# Ilse DeLange Records Web - Development Container Setup Script
# This script sets up the development environment after container creation

set -e

echo "🎵 Setting up Ilse DeLange Records Web development environment..."

# Install pnpm globally
echo "📦 Installing pnpm..."
npm install -g pnpm@latest

# Install dependencies
echo "📥 Installing project dependencies..."
pnpm install

# Install additional development tools
echo "🔧 Installing additional tools..."
npm install -g @vscode/vsce

# Setup git configuration if not already set
echo "🔧 Configuring Git..."
git config --global init.defaultBranch main
git config --global pull.rebase false
git config --global safe.directory /workspaces/*

# Create useful aliases
echo "⚡ Setting up aliases..."
echo 'alias ll="ls -la"' >> ~/.bashrc
echo 'alias dev="pnpm run dev"' >> ~/.bashrc
echo 'alias build="pnpm run build"' >> ~/.bashrc
echo 'alias validate="pnpm run build:validate"' >> ~/.bashrc
echo 'alias preview="pnpm run preview"' >> ~/.bashrc

# Make sure content files exist
echo "📋 Checking content files..."
if [ ! -f "public/content/albums.json" ]; then
  echo "⚠️  Content files missing - they should be committed to the repository"
else
  echo "✅ Content files found"
fi

# Display useful information
echo ""
echo "🎉 Development environment setup complete!"
echo ""
echo "📚 Available commands:"
echo "  pnpm run dev          - Start development server"
echo "  pnpm run build        - Build for production"
echo "  pnpm run build:validate - Build and validate content"
echo "  pnpm run preview      - Preview production build"
echo ""
echo "🔗 When dev server starts, it will be available at:"
echo "  http://localhost:3000 (forwarded automatically)"
echo ""
echo "📝 To get started:"
echo "  1. Run 'pnpm run dev' to start the development server"
echo "  2. Open the forwarded port in your browser"
echo "  3. Start coding! 🚀"
echo ""
