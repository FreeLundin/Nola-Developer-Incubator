# 🤝 Contributing to Mardi Gras Parade Simulator

Thank you for your interest in contributing! This guide will help you get started, whether you're a developer, designer, artist, or documentation writer.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [For Developers](#for-developers)
- [For Designers & Artists](#for-designers--artists)
- [For Documentation Writers](#for-documentation-writers)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for everyone. We expect all participants to:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Personal attacks or trolling
- Public or private harassment
- Publishing others' private information
- Unprofessional or unwelcoming conduct

### Enforcement

Violations of the code of conduct may result in temporary or permanent ban from the project. Report issues to the project maintainers.

---

## How Can I Contribute?

There are many ways to contribute, regardless of your skill level:

### 🐛 Report Bugs

Found a bug? Help us fix it!

1. **Check if it's already reported** - Search [existing issues](https://github.com/FreeLundin/Nola-Developer-Incubator/issues)
2. **Create a new issue** - If not found, open a new issue
3. **Include details**:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots or videos (if applicable)
   - Browser/device information
   - Console errors (press F12 → Console tab)

### 💡 Suggest Features

Have an idea for improvement?

1. **Check existing suggestions** - See if someone already proposed it
2. **Open a discussion** - Use [GitHub Discussions](https://github.com/FreeLundin/Nola-Developer-Incubator/discussions)
3. **Describe your idea**:
   - What problem does it solve?
   - How would it work?
   - Any implementation ideas?

### 📝 Improve Documentation

Documentation is crucial and always needs improvement!

- Fix typos or unclear explanations
- Add examples or tutorials
- Improve code comments
- Create diagrams or illustrations
- Translate to other languages

### 🎨 Create Assets

Help make the game more beautiful!

- **3D Models** - Parade floats, collectibles, environment
- **Textures** - Materials and surface details
- **Audio** - Sound effects and music
- **UI/UX** - Interface designs and improvements

### 💻 Write Code

Contribute code improvements!

- Fix bugs
- Implement new features
- Optimize performance
- Improve code quality
- Add tests

---

## Getting Started

### For All Contributors

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Nola-Developer-Incubator.git
   cd Nola-Developer-Incubator
   ```
3. **Create a branch** for your contribution:
   ```bash
   git checkout -b feature/my-contribution
   ```

### Set Up Development Environment

Follow the [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) for detailed setup instructions.

Quick setup:
```bash
npm install
npm run dev
```

---

## For Developers

### Finding Issues to Work On

- **Good first issues** - Labeled `good first issue` on GitHub
- **Help wanted** - Labeled `help wanted`
- **Bugs** - Labeled `bug`

### Development Workflow

1. **Assign yourself** - Comment on the issue that you're working on it
2. **Create a branch** - Use a descriptive name:
   - `feature/add-king-cake` - New features
   - `fix/collision-detection` - Bug fixes
   - `refactor/game-loop` - Code improvements
   - `docs/update-readme` - Documentation
3. **Make changes** - Follow coding standards (see below)
4. **Test thoroughly** - Ensure everything works
5. **Commit** - Use clear, descriptive commit messages
6. **Push** - Push your branch to your fork
7. **Open PR** - Create a pull request to the main repository

### Coding Standards

#### TypeScript
```typescript
// ✅ Good: Fully typed
interface PlayerState {
  position: Vector3;
  velocity: Vector3;
  score: number;
}

function updatePlayer(state: PlayerState, delta: number): void {
  state.position.add(state.velocity.multiplyScalar(delta));
}

// ❌ Avoid: Untyped
function updatePlayer(state, delta) {
  state.position.add(state.velocity.multiplyScalar(delta));
}
```

#### React Components
```typescript
// ✅ Good: Props interface and functional component
interface FloatProps {
  position: [number, number, number];
  speed: number;
  onPass?: () => void;
}

export function ParadeFloat({ position, speed, onPass }: FloatProps) {
  // Component logic
}

// ❌ Avoid: No types
export function ParadeFloat({ position, speed, onPass }) {
  // Component logic
}
```

#### File Organization
- One component per file
- PascalCase for components: `ParadeFloat.tsx`
- camelCase for utilities: `collisionDetection.ts`
- kebab-case for routes: `api/get-profile.ts`

#### Comments
```typescript
// ✅ Good: Explains "why" and complex logic
/**
 * Calculates throw trajectory using parabolic motion.
 * Ensures collectibles land within the playable area.
 */
function calculateThrowTrajectory(start: Vector3, force: number): Vector3 {
  // Use gravity constant to determine arc
  const gravity = -9.81;
  // Implementation...
}

// ❌ Avoid: States the obvious
// This function calculates the trajectory
function calculateThrowTrajectory(start, force) {
  // Do calculation
}
```

### Testing Your Changes

Before submitting a PR:

- [ ] Code runs without errors (`npm run dev`)
- [ ] TypeScript compiles (`npm run check`)
- [ ] Game is playable and fun
- [ ] No console errors or warnings
- [ ] Features work on desktop and mobile
- [ ] Performance is acceptable (45+ FPS)
- [ ] Code follows project style

---

## For Designers & Artists

You don't need coding experience to contribute! Here's how you can help:

### 3D Models

**What we need:**
- Parade floats (various themes: King Rex, Zulu, Endymion, etc.)
- Collectibles (beads, doubloons, cups, king cake)
- Environment objects (buildings, street decorations, crowds)

**Format requirements:**
- **File format**: glTF (.gltf or .glb preferred) or FBX
- **Polycount**: Keep it reasonable for web performance
  - Floats: <10,000 triangles
  - Collectibles: <1,000 triangles
  - Environment: <5,000 triangles per object
- **Textures**: Use compressed formats (JPG/PNG), max 2048x2048
- **Materials**: PBR materials (Metallic/Roughness workflow)

**How to contribute:**
1. Create your model in Blender, Maya, or other 3D software
2. Export as glTF or FBX
3. Test in [gltf-viewer.donmccurdy.com](https://gltf-viewer.donmccurdy.com/)
4. Create a PR with your model in `client/public/models/`
5. Include a preview screenshot

**Helpful resources:**
- [Blender Basics](https://www.blender.org/support/tutorials/)
- [glTF Export Guide](https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html)
- [PBR Materials Tutorial](https://learnopengl.com/PBR/Theory)

### Textures

**What we need:**
- Street textures (asphalt, sidewalk)
- Building textures (French Quarter style)
- Decorative textures (flags, banners, confetti)
- UI textures (icons, buttons, backgrounds)

**Requirements:**
- **Size**: Power of 2 (256, 512, 1024, 2048)
- **Format**: JPG for photos, PNG for transparency
- **Optimization**: Compress images to reduce file size
- **Seamless**: Tileable where appropriate

**How to contribute:**
1. Create texture in Photoshop, GIMP, or Substance Painter
2. Export in appropriate format
3. Place in `client/public/textures/`
4. Create a PR with your textures

### Audio

**What we need:**
- **Sound Effects**:
  - Catching collectibles (satisfying "ding")
  - Combo sounds (escalating excitement)
  - Power-up activation (energetic)
  - Level complete (celebratory)
  - UI sounds (clicks, hovers)
- **Music**:
  - Background music (festive, jazz-inspired)
  - Level complete fanfare
  - Menu music (welcoming)

**Requirements:**
- **Format**: MP3 or OGG
- **Quality**: 128-192 kbps (balance quality and file size)
- **Length**: 
  - SFX: <2 seconds
  - Loops: 30-60 seconds
  - Music: 2-3 minutes
- **Licensing**: Must be original or properly licensed

**How to contribute:**
1. Create or source audio (ensure you have rights)
2. Export in MP3 or OGG format
3. Place in `client/public/sounds/`
4. Create a PR with your audio files
5. Include a description of each sound

### UI/UX Design

**What we need:**
- Interface mockups
- Color scheme suggestions
- Layout improvements
- Icon designs
- Animation concepts

**How to contribute:**
1. Create mockups in Figma, Sketch, or similar tool
2. Export as PNG or PDF
3. Create a GitHub issue with your designs
4. Explain your design decisions
5. Discuss with the team

**Design principles:**
- **Accessibility**: High contrast, readable fonts
- **Mobile-friendly**: Works on small screens
- **Festive**: Captures Mardi Gras spirit
- **Clear**: Information is easy to find
- **Fun**: Playful and engaging

---

## For Documentation Writers

Great documentation helps everyone! Here's how to contribute:

### What to Document

- **Tutorials** - Step-by-step guides
- **Explanations** - How things work
- **Reference** - API documentation
- **Troubleshooting** - Common issues and solutions

### Documentation Standards

- **Clear language** - Write for beginners
- **Code examples** - Include working examples
- **Screenshots** - Visual aids help understanding
- **Keep updated** - Update docs when code changes
- **Link related content** - Help readers navigate

### How to Contribute

1. **Find what needs documentation** - Check for `docs` label on issues
2. **Write your documentation** - Use Markdown format
3. **Preview locally** - Ensure formatting is correct
4. **Submit PR** - Include your documentation changes

### Markdown Tips

```markdown
# Header 1
## Header 2
### Header 3

**Bold text**
*Italic text*
`inline code`

\```typescript
// Code block
function example() {
  return "Hello!";
}
\```

- Bullet list
- Another item

1. Numbered list
2. Another item

[Link text](https://example.com)
![Image alt text](image-url.png)
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass (for code changes)
- [ ] Documentation is updated (if needed)
- [ ] Commit messages are clear and descriptive
- [ ] Branch is up-to-date with main

### PR Template

When creating a PR, include:

**Description**
- What does this PR do?
- Why is this change needed?

**Type of Change**
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

**Testing**
- How did you test this?
- What browsers/devices did you test on?

**Screenshots**
- Include before/after screenshots for visual changes

**Checklist**
- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Reviewed my own code

### Review Process

1. **Automated checks** - CI/CD runs automatically
2. **Code review** - Maintainer reviews your code
3. **Feedback** - Address any requested changes
4. **Approval** - Once approved, maintainer merges PR
5. **Celebration!** - Your contribution is now part of the project! 🎉

### After Your PR is Merged

- Delete your feature branch (GitHub offers this option)
- Update your fork's main branch:
  ```bash
  git checkout main
  git pull upstream main
  git push origin main
  ```
- Look for more issues to work on!

---

## Style Guidelines

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `perf` - Performance improvement
- `test` - Tests
- `chore` - Maintenance

**Examples:**
```bash
feat(game): add king cake collectible
fix(collision): improve catch detection accuracy
docs(readme): update installation instructions
style(ui): improve button contrast
refactor(stores): simplify game state logic
perf(rendering): reduce draw calls
```

### Branch Names

Use descriptive branch names:

- `feature/king-cake-collectible`
- `fix/collision-bug`
- `docs/contribution-guide`
- `refactor/game-loop`

### Code Style

Follow the existing code style in the project:

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings (when possible)
- **Semicolons**: Use them
- **Line length**: ~80-100 characters (not strict)
- **Naming**: 
  - PascalCase for components and classes
  - camelCase for functions and variables
  - UPPER_SNAKE_CASE for constants

---

<<<<<<< HEAD
=======
## Communication & Best Practices

To reduce friction and speed up review/merge cycles, follow these simple rules when contributing or requesting merges:

- Small PRs get merged faster: prefer PRs that change one feature or fix one bug and are <= 200 lines when possible.
- Provide a short PR summary at the top of the description, followed by: What, Why, How to test, and Public playtest URL used.
- Use the Asset Submission Template for design PRs: `docs/ASSET_SUBMISSION_TEMPLATE.md`.
- Label PRs correctly: `bug`, `feat`, `docs`, `design`, `urgent`, `needs-review`.
- Expected turnaround times (guideline):
  - Small PRs (<200 lines): 24-48 hours
  - Medium PRs: 48-96 hours
  - Large/Complex PRs: allow 1-2 weeks for full review
- Mark urgent PRs by adding the `urgent` label and mentioning `@BLund` in the PR body (short justification required).
- Include the canonical playtest link or `docs/launch.html` snapshot for external QA.
- When possible, add a short recording or screenshot for visual changes.

Automated merges / bot help
- If you want me to programmatically create and merge PRs on your behalf, provide a short-lived GitHub Personal Access Token (PAT) with `repo` scope. I will use it only to create and merge the PR you approve, then remove any local traces of the token.
- If you prefer not to share a token, use the PR page I opened earlier to create and merge manually: https://github.com/FreeLundin/MardiGrasParadeGame/pull/new/chore/public-playtest-docs

Why this helps
- Clear, consistent PRs reduce back-and-forth and speed merges.
- Using the canonical playtest URL ensures reviewers test the same build.

---

>>>>>>> origin/main
## Getting Help

### Resources

- **[DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)** - Technical documentation
- **[GitHub Issues](https://github.com/FreeLundin/Nola-Developer-Incubator/issues)** - Ask questions
- **[GitHub Discussions](https://github.com/FreeLundin/Nola-Developer-Incubator/discussions)** - General chat

### Communication

- Be respectful and patient
- Search for existing answers before asking
- Provide context and details in questions
- Help others when you can

---

## Recognition

Contributors are recognized in several ways:

- **Contributors list** - Added to GitHub contributors
- **Changelog** - Mentioned in release notes
- **Credits** - Listed in the game credits (coming soon)

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Thank You!

Every contribution, no matter how small, helps make this project better. Whether you're fixing a typo, adding a feature, or creating assets, you're helping bring the spirit of Mardi Gras to players everywhere.

**Laissez les bons temps rouler!** 🎭🎉

---

**Questions?** Don't hesitate to ask! Open an issue or discussion on GitHub.

**Ready to contribute?** Check out the [good first issues](https://github.com/FreeLundin/Nola-Developer-Incubator/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) to get started!
