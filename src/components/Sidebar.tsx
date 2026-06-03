import { Plus, MessageSquare, User } from 'lucide-react'

const recentChats = [
  'Remote work research',
  'Pricing analysis',
  'Resume feedback',
]

export default function Sidebar() {
  return (
    <div className="w-[260px] flex-shrink-0 bg-[#171717] flex flex-col h-full">
      <div className="p-3">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-[#353641] text-[#ECECF1] text-sm font-medium hover:bg-[#2A2B32] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#10A37F80]">
          <Plus size={16} />
          New chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A8A8A] px-2 py-2">
          Recent
        </p>
        <ul className="space-y-0.5">
          {recentChats.map((title) => (
            <li key={title}>
              <button className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-[#B4B4B4] hover:bg-[#2A2B32] hover:text-[#ECECF1] transition-colors duration-200 text-left focus:outline-none focus:ring-2 focus:ring-[#10A37F80]">
                <MessageSquare size={14} className="flex-shrink-0 text-[#8A8A8A]" />
                <span className="truncate">{title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-3 border-t border-[#2D2D3A]">
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-[#2A2B32] transition-colors duration-200 cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-[#10A37F] flex items-center justify-center flex-shrink-0">
            <User size={14} className="text-white" />
          </div>
          <span className="text-sm text-[#ECECF1] font-medium">User</span>
        </div>
      </div>
    </div>
  )
}
