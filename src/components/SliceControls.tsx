import { useStore } from '../store';
import { ArrowUpCircle, ArrowDownCircle, ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';

interface SliceControlsProps {
  axis: 'x' | 'y' | 'z';
  layer: -1 | 0 | 1;
  label: string;
}

export function SliceControls({ axis, layer, label }: SliceControlsProps) {
  const { rotateSlice, isAnimating } = useStore();

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => rotateSlice(axis, layer, true)}
          className="p-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={`Rotate ${label} clockwise`}
          disabled={isAnimating}
        >
          <ArrowRightCircle className="w-5 h-5 text-indigo-600" />
        </button>
        <button
          onClick={() => rotateSlice(axis, layer, false)}
          className="p-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={`Rotate ${label} counter-clockwise`}
          disabled={isAnimating}
        >
          <ArrowLeftCircle className="w-5 h-5 text-indigo-600" />
        </button>
      </div>
    </div>
  );
}