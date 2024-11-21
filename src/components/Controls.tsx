import { Rotate3D, RotateCcw, RotateCw } from 'lucide-react';
import { useStore } from '../store';
import { SliceControls } from './SliceControls';

export function Controls() {
  const { 
    rotateLeft, 
    rotateRight, 
    rotateUp, 
    rotateDown,
    resetRotation
  } = useStore();

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={resetRotation}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Reset rotation"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={rotateLeft}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Rotate left"
            >
              <RotateCw className="w-6 h-6 transform rotate-90" />
            </button>
            <button
              onClick={rotateRight}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Rotate right"
            >
              <RotateCw className="w-6 h-6 transform -rotate-90" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={rotateUp}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Rotate up"
            >
              <Rotate3D className="w-6 h-6 transform -rotate-90" />
            </button>
            <button
              onClick={rotateDown}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Rotate down"
            >
              <Rotate3D className="w-6 h-6 transform rotate-90" />
            </button>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="grid grid-cols-3 gap-4">
            <SliceControls axis="x" layer={-1} label="Left Face" />
            <SliceControls axis="x" layer={0} label="Middle X" />
            <SliceControls axis="x" layer={1} label="Right Face" />
            
            <SliceControls axis="y" layer={-1} label="Bottom Face" />
            <SliceControls axis="y" layer={0} label="Middle Y" />
            <SliceControls axis="y" layer={1} label="Top Face" />
            
            <SliceControls axis="z" layer={-1} label="Back Face" />
            <SliceControls axis="z" layer={0} label="Middle Z" />
            <SliceControls axis="z" layer={1} label="Front Face" />
          </div>
        </div>
      </div>
    </div>
  );
}