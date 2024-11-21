import { useRef } from 'react';
import { Mesh } from 'three';

interface CubieProps {
  position: [number, number, number];
  rotation: [number, number, number];
  colors: string[];
}

export function Cubie({ position, rotation, colors }: CubieProps) {
  const meshRef = useRef<Mesh>(null);

  return (
    <mesh 
      ref={meshRef} 
      position={position}
      rotation={rotation}
    >
      <boxGeometry args={[0.95, 0.95, 0.95]} />
      {colors.map((color, index) => (
        <meshStandardMaterial 
          key={index} 
          attach={`material-${index}`} 
          color={color}
        />
      ))}
    </mesh>
  );
}