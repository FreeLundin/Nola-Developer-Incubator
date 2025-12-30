import React from 'react';
import {useThree} from '@react-three/fiber';

// Try to dynamically require postprocessing components to avoid hard dependency at runtime
let EffectComposer: any = null;
let Bloom: any = null;
let ChromaticAberration: any = null;
let Vignette: any = null;
let BlendFunction: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const post = require('@react-three/postprocessing');
  EffectComposer = post.EffectComposer;
  Bloom = post.Bloom;
  ChromaticAberration = post.ChromaticAberration;
  Vignette = post.Vignette;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  BlendFunction = require('postprocessing').BlendFunction;
} catch (e) {
  // Postprocessing not installed — we'll gracefully degrade
  // console.warn('Postprocessing not available:', e);
}

interface PostProcessingProps {
  bloomIntensity?: number;
}

export function PostProcessing({ bloomIntensity = 0.28 }: PostProcessingProps) {
  const { gl } = useThree();

  // If postprocessing libs are not available, render nothing
  if (!EffectComposer || !Bloom) return null;

  return (
    <EffectComposer multisampling={0} disableNormalPass>
      <Bloom
        luminanceThreshold={0.85}
        luminanceSmoothing={0.15}
        intensity={bloomIntensity}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.0005, 0.001]}
      />
      <Vignette eskil={false} offset={0.2} darkness={0.25} />
    </EffectComposer>
  );
}

