import React from 'react';
import {useThree} from '@react-three/fiber';

let EffectComposer: any = null;
let DepthOfField: any = null;
let LUTPass: any = null;
let BlendFunction: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const post = require('@react-three/postprocessing');
  EffectComposer = post.EffectComposer;
  DepthOfField = post.DepthOfField;
  // LUT support might require a custom pass; attempt to require a LUT pass from postprocessing
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const postproc = require('postprocessing');
  BlendFunction = postproc.BlendFunction;
  // No official LUT component in @react-three/postprocessing; keep placeholder
} catch (e) {
  // graceful fallback
}

interface AdvancedPostProcessingProps {
  enabled?: boolean;
}

export function AdvancedPostProcessing({ enabled = true }: AdvancedPostProcessingProps) {
  const { gl } = useThree();
  const isAvailable = !!EffectComposer && !!DepthOfField;

  if (!enabled || !isAvailable) return null;

  // DepthOfField parameters tuned for subtle cinematic feel
  return (
    <EffectComposer multisampling={0}>
      <DepthOfField focusDistance={0.02} focalLength={0.02} bokehScale={2} />
      {/* Additional passes like LUT or color grading can be added here if available */}
    </EffectComposer>
  );
}

