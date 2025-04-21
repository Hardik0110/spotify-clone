import { PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon, VolumeIcon } from 'lucide-react';

interface MusicPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
}

export function MusicPlayer({ isPlaying, setIsPlaying}: MusicPlayerProps) {
  return <div className="bg-[#493D9E] border-t border-[#B2A5FF] py-4 px-6 sticky bottom-0">
      <div className="max-w-screen-xl mx-auto flex flex-col gap-2">
        <div className="w-full bg-[#B2A5FF]/30 h-1 rounded-full overflow-hidden">
          <div className="bg-[#FFF2AF] w-0 h-full rounded-full"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-[#DAD2FF]">--:--</div>
          <div className="flex items-center gap-4">
            <button className="text-[#DAD2FF] hover:text-[#FFF2AF] transition-colors">
              <SkipBackIcon size={24} />
            </button>
            <button className="bg-[#DAD2FF] text-[#493D9E] p-2 rounded-full hover:bg-[#FFF2AF] transition-colors" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
            </button>
            <button className="text-[#DAD2FF] hover:text-[#FFF2AF] transition-colors">
              <SkipForwardIcon size={24} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <VolumeIcon size={18} className="text-[#DAD2FF]" />
            <div className="w-20 bg-[#B2A5FF]/30 h-1 rounded-full overflow-hidden">
              <div className="bg-[#DAD2FF] w-1/2 h-full rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}