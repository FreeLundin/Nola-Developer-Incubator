import {useEffect} from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';

export function HDRIEnvironment({ envUrl }: { envUrl?: string }) {
  const { scene } = useThree();

  useEffect(() => {
    if (!envUrl) return;
    let mounted = true;
    // Dynamic import to avoid hard dependency
    Promise.resolve().then(async () => {
      try {
        const module = await import('three/examples/jsm/loaders/RGBELoader');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const RGBELoader: any = (module as any).RGBELoader;
        const loader = new RGBELoader();
        loader.setDataType(THREE.UnsignedByteType as any);
        loader.load(envUrl, (tex: any) => {
          if (!mounted) return;
          tex.mapping = THREE.EquirectangularReflectionMapping;
          scene.environment = tex;
        });
      } catch (e) {
        // graceful fallback
      }
    });

    return () => { mounted = false; };
  }, [envUrl, scene]);

  return null;
}
