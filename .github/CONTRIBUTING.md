# Contributing to Mardi Gras Parade Game

Thank you for your interest in contributing to the Mardi Gras Parade Game! This document provides guidelines and instructions for contributing to this project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Submitting Contributions](#submitting-contributions)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [License](#license)

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Expected Behavior
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences
- Show empathy towards other community members

### Unacceptable Behavior
- Harassment, discrimination, or offensive comments
- Trolling, insulting, or derogatory remarks
- Personal or political attacks
- Publishing others' private information
- Other conduct inappropriate for a professional setting

## Getting Started

### Prerequisites
- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Git** for version control
- A code editor (VS Code recommended)

### Initial Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/MardiGrasParadeGame.git
   cd MardiGrasParadeGame
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/Nola-Developer-Incubator/MardiGrasParadeGame.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open http://localhost:5000 in your browser

## Development Workflow

### Working on a Feature or Bug Fix

1. **Sync with upstream**:
   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make your changes** following our [coding standards](#coding-standards)

4. **Test your changes**:
   ```bash
   npm run check        # TypeScript type checking
   npm run build        # Build the project
   npm run dev          # Test locally
   ```

5. **Commit your changes** using [conventional commits](#commit-message-guidelines)

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request** on GitHub

### Keeping Your Fork Updated

```bash
git checkout main
git pull upstream main
git push origin main
```

## Submitting Contributions

### Before Submitting a PR

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm run check`, `npm run build`)
- [ ] You've tested your changes locally
- [ ] Documentation has been updated (if needed)
- [ ] Commit messages follow conventional commit format
- [ ] PR description clearly explains the changes

### Pull Request Process

1. **Fill out the PR template** completely
2. **Link related issues** using "Fixes #123" or "Closes #456"
3. **Request review** from maintainers
4. **Address feedback** promptly and professionally
5. **Squash commits** if requested by maintainers
6. **Wait for approval** from at least one maintainer

### PR Review Criteria

Maintainers will review PRs based on:
- Code quality and adherence to standards
- Test coverage and passing CI checks
- Documentation completeness
- Impact on existing functionality
- Performance considerations
- Security best practices

## Coding Standards

### TypeScript

- **Use strict mode** - TypeScript strict mode is enabled
- **Type everything** - Avoid `any`, use proper interfaces and types
- **Export shared types** - Put types used by both frontend and backend in `shared/`
- **Prefer interfaces** for object shapes over type aliases

### React Components

- **Functional components only** - Use React hooks, no class components
- **Define prop interfaces** - Always use TypeScript interfaces for component props
- **PascalCase for components** - `ParadeFloat.tsx`, `GameUI.tsx`
- **Custom hooks** - Extract reusable logic into hooks prefixed with `use`

### File Naming

- **Components**: PascalCase - `ParadeFloat.tsx`, `GameUI.tsx`
- **Hooks**: camelCase with `use` prefix - `useGameLoop.ts`
- **Utilities**: camelCase - `collision.ts`, `physics.ts`
- **API routes**: kebab-case - `api/get-profile.ts`

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Always use semicolons
- **Line length**: Aim for 80-100 characters
- **Naming**:
  - PascalCase: Components, classes, interfaces
  - camelCase: Functions, variables, properties
  - UPPER_SNAKE_CASE: Constants

### Comments

- **Explain "why" not "what"** - Comment complex logic and decisions
- **Use JSDoc** for public APIs and exported functions
- **Mark incomplete work** with `// TODO:`
- **Avoid obvious comments**

### Example

```typescript
interface GameProps {
  score: number;
  level: number;
  onGameOver: () => void;
}

/**
 * Main game component that renders the 3D parade scene
 * and handles game state management.
 */
export function Game({ score, level, onGameOver }: GameProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    // Update game physics each frame
    if (meshRef.current) {
      meshRef.current.position.z += delta * 2;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="purple" />
    </mesh>
  );
}
```

## Testing Guidelines

### Manual Testing

1. **Test in dev environment**: `npm run dev`
2. **Test production build**: `npm run build && npm start`
3. **Test on multiple browsers**: Chrome, Firefox, Safari
4. **Test on mobile**: Use DevTools device emulation
5. **Check console**: Ensure no errors or warnings
6. **Verify performance**: Monitor FPS with browser DevTools

### Automated Testing

#### Playwright E2E Tests

```bash
# Run all tests
npx playwright test

# Run tests in headed mode
npx playwright test --headed

# Run tests in UI mode
npx playwright test --ui

# Run specific test file
npx playwright test tests/e2e/homepage.spec.ts
```

#### Writing Tests

- Place E2E tests in `tests/e2e/`
- Use descriptive test names
- Follow existing test patterns
- Ensure tests are deterministic
- Clean up after tests

Example test:
```typescript
import { test, expect } from '@playwright/test';

test('should catch a bead', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Start Game');
  
  // Wait for game to load
  await page.waitForSelector('canvas');
  
  // Simulate catching a bead
  const canvas = page.locator('canvas');
  await canvas.click({ position: { x: 100, y: 100 } });
  
  // Verify score increased
  const score = await page.locator('[data-testid="score"]').textContent();
  expect(parseInt(score || '0')).toBeGreaterThan(0);
});
```

### Pre-Commit Checklist

- [ ] Code runs without errors
- [ ] TypeScript compiles (`npm run check`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors or warnings
- [ ] Tests pass (if applicable)
- [ ] Changes are minimal and focused

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code formatting (no logic change)
- **refactor**: Code restructuring (no behavior change)
- **perf**: Performance improvements
- **test**: Test additions or changes
- **chore**: Build process, tooling, dependencies

### Examples

```
feat(game): add king cake collectible
fix(collision): correct catch radius calculation
docs(readme): update installation instructions
refactor(stores): simplify game state logic
perf(rendering): reduce draw calls for better FPS
test(e2e): add homepage smoke test
chore(deps): update three.js to v0.160.0
```

### Scope

Use scopes to indicate which part of the codebase changed:
- `game`: Game logic and mechanics
- `ui`: User interface components
- `collision`: Collision detection
- `rendering`: Graphics and rendering
- `audio`: Sound and music
- `api`: Backend API
- `db`: Database changes
- `ci`: CI/CD configuration
- `docs`: Documentation

## Reporting Issues

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check documentation** for answers
3. **Update to latest version** to see if issue persists
4. **Collect information** about your environment

### Creating a Bug Report

Use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos if applicable
- Environment details (OS, browser, version)
- Console errors (if any)

### Creating a Feature Request

Use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) and include:
- Clear description of the feature
- Problem it solves
- Proposed solution
- Alternative solutions considered
- Use cases and benefits

## Community Guidelines

### Getting Help

- **Documentation**: Check the [docs/](docs/) directory
- **Issues**: Search existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions and ideas

### Communication

- Be patient and respectful
- Provide context and details
- Follow up on your issues and PRs
- Thank contributors for their help

## License

By contributing to this project, you agree that your contributions will be licensed under the project's Business Source License 1.1 (converting to MIT License on 2028-12-20).

See the [LICENSE](../LICENSE) file for details.

---

## Additional Resources

- [Project README](../README.md)
- [Development Guide](../docs/DEVELOPMENT_GUIDE.md)
- [Technical Documentation](../docs/TechnicalDocumentation.md)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Documentation](https://threejs.org/docs)

---

## Questions?

If you have questions not covered in this guide, please:
1. Check the documentation in the [docs/](docs/) directory
2. Search existing issues and discussions
3. Create a new discussion on GitHub

Thank you for contributing to the Mardi Gras Parade Game! 🎭 🎉 🎊
