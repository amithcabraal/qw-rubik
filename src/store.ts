import { create } from 'zustand';
import { Matrix4, Quaternion, Vector3, Euler } from 'three';

interface CubieState {
  position: [number, number, number];
  rotation: [number, number, number];
  colors: string[];
  animating?: {
    startRotation: [number, number, number];
    targetRotation: [number, number, number];
    startTime: number;
    duration: number;
    axis: 'x' | 'y' | 'z';
  };
}

interface CubeState {
  rotationX: number;
  rotationY: number;
  cubies: Map<string, CubieState>;
  isAnimating: boolean;
  rotateLeft: () => void;
  rotateRight: () => void;
  rotateUp: () => void;
  rotateDown: () => void;
  resetRotation: () => void;
  rotateSlice: (axis: 'x' | 'y' | 'z', layer: -1 | 0 | 1, clockwise: boolean) => void;
  updateAnimation: (time: number) => void;
}

const COLORS = {
  front: '#ff0000',  // Red
  back: '#ff8c00',   // Orange
  top: '#ffffff',    // White
  bottom: '#ffff00', // Yellow
  right: '#00ff00',  // Green
  left: '#0000ff',   // Blue
  inner: '#1a1a1a',  // Dark gray
};

const ANIMATION_DURATION = 500; // milliseconds

const getInitialColors = (x: number, y: number, z: number): string[] => [
  x === 1 ? COLORS.right : COLORS.inner,   // right
  x === -1 ? COLORS.left : COLORS.inner,   // left
  y === 1 ? COLORS.top : COLORS.inner,     // top
  y === -1 ? COLORS.bottom : COLORS.inner, // bottom
  z === 1 ? COLORS.front : COLORS.inner,   // front
  z === -1 ? COLORS.back : COLORS.inner,   // back
];

const initialCubies = new Map(
  [-1, 0, 1].flatMap(x =>
    [-1, 0, 1].flatMap(y =>
      [-1, 0, 1].map(z => [
        `${x},${y},${z}`,
        {
          position: [x, y, z] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          colors: getInitialColors(x, y, z),
        }
      ])
    )
  )
);

const rotateColorsForAxis = (colors: string[], axis: 'x' | 'y' | 'z', clockwise: boolean): string[] => {
  const newColors = [...colors];
  let indices: number[] = [];
  
  switch (axis) {
    case 'x': indices = [2, 4, 3, 5]; break; // top, front, bottom, back
    case 'y': indices = [4, 1, 5, 0]; break; // front, left, back, right
    case 'z': indices = [2, 0, 3, 1]; break; // top, right, bottom, left
  }
  
  const [a, b, c, d] = indices;
  if (clockwise) {
    [newColors[a], newColors[b], newColors[c], newColors[d]] = 
    [newColors[d], newColors[a], newColors[b], newColors[c]];
  } else {
    [newColors[a], newColors[b], newColors[c], newColors[d]] = 
    [newColors[b], newColors[c], newColors[d], newColors[a]];
  }
  
  return newColors;
};

const rotateAroundAxis = (position: [number, number, number], axis: 'x' | 'y' | 'z', clockwise: boolean): [number, number, number] => {
  const matrix = new Matrix4();
  const quaternion = new Quaternion();
  const angle = (Math.PI / 2) * (clockwise ? -1 : 1);
  
  switch (axis) {
    case 'x': quaternion.setFromAxisAngle(new Vector3(1, 0, 0), angle); break;
    case 'y': quaternion.setFromAxisAngle(new Vector3(0, 1, 0), angle); break;
    case 'z': quaternion.setFromAxisAngle(new Vector3(0, 0, 1), angle); break;
  }
  
  matrix.makeRotationFromQuaternion(quaternion);
  const vector = new Vector3(...position);
  vector.applyMatrix4(matrix);
  
  return [
    Math.round(vector.x),
    Math.round(vector.y),
    Math.round(vector.z)
  ] as [number, number, number];
};

export const useStore = create<CubeState>((set, get) => ({
  rotationX: 0.5,
  rotationY: 0.5,
  cubies: initialCubies,
  isAnimating: false,
  rotateLeft: () => set((state) => ({ rotationY: state.rotationY - 0.5 })),
  rotateRight: () => set((state) => ({ rotationY: state.rotationY + 0.5 })),
  rotateUp: () => set((state) => ({ rotationX: state.rotationX - 0.5 })),
  rotateDown: () => set((state) => ({ rotationX: state.rotationX + 0.5 })),
  resetRotation: () => set({ rotationX: 0.5, rotationY: 0.5 }),
  
  rotateSlice: (axis, layer, clockwise) => {
    const state = get();
    if (state.isAnimating) return;

    const newCubies = new Map(state.cubies);
    const currentTime = performance.now();
    
    Array.from(state.cubies.entries())
      .filter(([_, data]) => Math.round(data.position[axis === 'x' ? 0 : axis === 'y' ? 1 : 2]) === layer)
      .forEach(([key, data]) => {
        const newPos = rotateAroundAxis(data.position, axis, clockwise);
        const newColors = rotateColorsForAxis(data.colors, axis, clockwise);
        
        const startRotation = [...data.rotation] as [number, number, number];
        const targetRotation = [...startRotation] as [number, number, number];
        const rotationIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
        targetRotation[rotationIndex] += clockwise ? -Math.PI / 2 : Math.PI / 2;
        
        newCubies.set(key, {
          position: newPos,
          rotation: startRotation,
          colors: newColors,
          animating: {
            startRotation,
            targetRotation,
            startTime: currentTime,
            duration: ANIMATION_DURATION,
            axis,
          },
        });
      });
    
    set({ cubies: newCubies, isAnimating: true });
  },

  updateAnimation: (currentTime: number) => {
    const state = get();
    let stillAnimating = false;
    const newCubies = new Map(state.cubies);

    Array.from(state.cubies.entries()).forEach(([key, cubie]) => {
      if (cubie.animating) {
        const { startTime, duration, startRotation, targetRotation } = cubie.animating;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        if (progress < 1) {
          stillAnimating = true;
          const newRotation = startRotation.map((start, i) => {
            const target = targetRotation[i];
            return start + (target - start) * progress;
          }) as [number, number, number];

          newCubies.set(key, {
            ...cubie,
            rotation: newRotation,
          });
        } else {
          newCubies.set(key, {
            ...cubie,
            rotation: targetRotation,
            animating: undefined,
          });
        }
      }
    });

    if (state.isAnimating !== stillAnimating || stillAnimating) {
      set({ cubies: newCubies, isAnimating: stillAnimating });
    }
  },
}));