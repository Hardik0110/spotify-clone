import { MusicIcon } from 'lucide-react';

export function CurrentSong() {
  return <div className="bg-[#B2A5FF] rounded-xl p-4 shadow-lg flex flex-col items-center justify-center h-[400px]">
      <h2 className="text-xl font-semibold text-[#493D9E] mb-4">Now Playing</h2>
      <div className="bg-[#DAD2FF] h-48 w-48 rounded-lg flex items-center justify-center mb-4">
        <MusicIcon size={64} className="text-[#493D9E]" />
      </div>
      <p className="text-[#493D9E] text-lg">No song selected</p>
    </div>;
}