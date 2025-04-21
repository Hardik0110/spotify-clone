import  { useState } from 'react';
import { SearchIcon } from 'lucide-react';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  return <header className="bg-[#493D9E] py-4 px-4 md:px-8 shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#FFF2AF]">
          Mujik Player
        </h1>
        <div className="relative w-full md:w-1/2 lg:w-1/3">
          <input type="text" placeholder="Search for songs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full py-2 px-4 pr-10 rounded-full bg-[#B2A5FF] text-[#493D9E] placeholder-[#493D9E]/70 focus:outline-none focus:ring-2 focus:ring-[#DAD2FF]" />
          <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#493D9E] h-5 w-5" />
        </div>
      </div>
    </header>;
}