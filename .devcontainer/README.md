# Development Container Configuration

This repository includes a complete development container configuration for GitHub Codespaces and VS Code Remote Containers.

## 🚀 Quick Start with GitHub Codespaces

1. **Click "Code" → "Create codespace on main"** in the GitHub repository
2. **Wait for setup** - The container will automatically install dependencies
3. **Start developing** - Run `pnpm run dev` to start the development server

## 🛠️ What's Included

### Base Environment
- **Node.js 18** - Latest LTS version
- **pnpm** - Fast, disk space efficient package manager
- **Git & GitHub CLI** - Version control and GitHub integration

### VS Code Extensions
- **React Development**: ES7 snippets, auto-rename tags, React Native tools
- **Styling**: Tailwind CSS IntelliSense with custom class detection
- **Code Quality**: ESLint, Prettier with auto-formatting
- **GitHub Integration**: Pull requests, Copilot, Copilot Chat
- **Utilities**: Thunder Client for API testing, Live Server, Markdown tools

### Port Forwarding
- **3000** - Vite development server (auto-forwarded)
- **5173** - Alternative Vite port
- **4173** - Vite preview server

### Development Tools
- **Auto-formatting** on save with Prettier
- **ESLint** integration with auto-fix
- **Tailwind CSS** IntelliSense with custom patterns
- **Volume mounting** for fast node_modules access

## 📋 Available Commands

The setup script creates helpful aliases:

```bash
dev          # pnpm run dev
build        # pnpm run build  
validate     # pnpm run build:validate
preview      # pnpm run preview
```

## 🔧 Customization

### Adding Extensions
Edit `.devcontainer/devcontainer.json` to add more VS Code extensions:

```json
"extensions": [
  "your.extension.id"
]
```

### Modifying Setup
Edit `.devcontainer/setup.sh` to add additional setup steps:

```bash
# Add your custom setup commands
npm install -g your-tool
```

### Environment Variables
Add environment variables in `devcontainer.json`:

```json
"containerEnv": {
  "NODE_ENV": "development"
}
```

## 📊 Performance Features

- **Volume mounting** for node_modules (faster installs)
- **Persistent git configuration**
- **Pre-installed tools** (no setup delays)
- **Optimized VS Code settings** for the project

## 🐛 Troubleshooting

### Port Issues
If the development server doesn't auto-forward:
1. Check the **Ports** tab in VS Code
2. Manually forward port 3000
3. Open in browser

### Permission Issues
If you encounter permission errors:
```bash
sudo chown -R node:node /workspaces
```

### Missing Dependencies
If dependencies aren't installed:
```bash
pnpm install
```

### Content Files Missing
If content validation fails:
- Check that `public/content/*.json` files exist
- Run `git pull` to ensure latest content is available

## 🎯 Project-Specific Features

This devcontainer is specifically configured for the Ilse DeLange Records website:

- **Content validation** - Includes build:validate command
- **Tailwind patterns** - Recognizes `cn()`, `clsx()` class patterns  
- **React optimizations** - Snippets and auto-completion
- **JSON schema** - Validation for content files
- **GitHub Actions** - Extensions for workflow editing

The environment is ready for both content editing and code development!
