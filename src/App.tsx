import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RubiksCube } from './components/RubiksCube';
import { Controls } from './components/Controls';

function App() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <RubiksCube />
        <OrbitControls enablePan={false} />
      </Canvas>
      <Controls />
    </div>
  );
}

export default App;