const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const modelsDir = path.resolve(__dirname, '..', 'client', 'public', 'models');
const outDir = path.resolve(modelsDir, 'optimized');

function main() {
  if (!fs.existsSync(modelsDir)) {
    console.log('No models directory found at', modelsDir, '\nSkipping GLTF optimization.');
    return;
  }

  const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.glb') || f.endsWith('.gltf'));
  if (files.length === 0) {
    console.log('No .glb/.gltf files found in', modelsDir, '\nSkipping GLTF optimization.');
    return;
  }

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const cmd = `npx gltf-transform batch "${modelsDir}" "${outDir}" --draco.compress=true --draco.quantize=14`;
  console.log('Running:', cmd);
  try {
    const out = execSync(cmd, { stdio: 'inherit' });
    console.log('GLTF optimization completed. Output written to', outDir);
  } catch (err) {
    console.warn('GLTF optimization failed. Please ensure gltf-transform is installed (npm i -D @gltf-transform/cli) or run the command locally.');
    // Do not exit with error so CI doesn't fail; caller can inspect logs.
  }
}

main();

