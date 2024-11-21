import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../store';
import { Cubie } from './Cubie';
import { Group } from 'three';

export function RubiksCube() {
  const ref = useRef<Group>(null);
  const { rotationX, rotationY, cubies, updateAnimation } = useStore();

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x = rotationX;
      ref.current.rotation.y = rotationY;
    }
    updateAnimation(performance.now());
  });

  return (
    <group ref={ref}>
      {Array.from(cubies.entries()).map(([key, data]) => (
        <Cubie 
          key={key}
          position={data.position}
          rotation={data.rotation}
          colors={data.colors}
        />
      ))}
    </group>
  );
}