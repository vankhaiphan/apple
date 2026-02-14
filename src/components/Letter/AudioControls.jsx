import { Play, Pause, RotateCcw } from 'lucide-react';

export default function AudioControls({ audio }) {
  const { isPlaying, currentTime, duration, toggle, seek, hasError } = audio;

  // Don't show audio controls if there's an error loading the audio
  if (hasError || !duration) {
    return null;
  }

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    seek(percentage * duration);
  };

  const handleRestart = () => {
    seek(0);
  };

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div
        className="w-full h-2 bg-romantic-200 rounded-full cursor-pointer relative overflow-hidden"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-gradient-to-r from-romantic-400 to-romantic-500 rounded-full transition-all"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Play/Pause button */}
          <button
            onClick={toggle}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-romantic-400 to-romantic-500 hover:from-romantic-500 hover:to-romantic-600 text-white flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" fill="white" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" fill="white" />
            )}
          </button>

          {/* Restart button */}
          <button
            onClick={handleRestart}
            className="w-10 h-10 rounded-full bg-romantic-200 hover:bg-romantic-300 text-romantic-600 flex items-center justify-center transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Time display */}
        <div className="text-romantic-600 text-sm font-medium">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
}
