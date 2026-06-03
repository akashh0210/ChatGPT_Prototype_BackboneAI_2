import { ChevronDown, Share2, MoreHorizontal } from 'lucide-react'

export default function Header() {
  return (
    <header className="flex items-center justify-between h-12 px-4 border-b border-[#2D2D3A] bg-[#212121] flex-shrink-0">
      <button className="flex items-center gap-1.5 text-[#ECECF1] font-medium text-base hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#10A37F80] rounded">
        ChatGPT
        <ChevronDown size={16} className="text-[#8A8A8A]" />
      </button>

      <div className="flex items-center gap-1">
        <button
          aria-label="Share conversation"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[#B4B4B4] hover:bg-[#2A2B32] hover:text-[#ECECF1] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#10A37F80]"
        >
          <Share2 size={15} />
          <span>Share</span>
        </button>
        <button
          aria-label="More options"
          className="p-1.5 rounded-lg text-[#B4B4B4] hover:bg-[#2A2B32] hover:text-[#ECECF1] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#10A37F80]"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
    </header>
  )
}
