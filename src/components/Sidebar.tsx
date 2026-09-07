import {
  Search,
  PanelLeft,
  SquarePen,
  Image,
  Library,
  Clock,
  AtSign,
  FolderOpen,
  Hexagon,
  MoreHorizontal,
} from 'lucide-react'

const navItems = [
  { label: 'Images', Icon: Image },
  { label: 'Library', Icon: Library },
  { label: 'Scheduled', Icon: Clock },
  { label: 'Plugins', Icon: AtSign },
  { label: 'Projects', Icon: FolderOpen },
  { label: 'Codex', Icon: Hexagon },
  { label: 'More', Icon: MoreHorizontal },
]

const recentChats = [
  'Remote work research',
  'Pricing analysis',
  'Resume feedback',
  'Confidence calibration notes',
  'Evaluator model comparison',
]

interface Props {
  onNewChat?: () => void
}

export default function Sidebar({ onNewChat }: Props) {
  return (
    <div className="w-[260px] flex-shrink-0 bg-bg-secondary flex flex-col h-full">
      {/* Wordmark row */}
      <div className="flex items-center justify-between px-3 h-[52px] flex-shrink-0">
        <span className="text-[17px] font-bold text-text-primary tracking-[-0.01em] pl-1">
          ChatGPT
        </span>
        <div className="flex items-center gap-0.5">
          <button
            aria-label="Search chats"
            className="p-1.5 rounded-lg text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <Search size={18} />
          </button>
          <button
            aria-label="Toggle sidebar"
            className="p-1.5 rounded-lg text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <PanelLeft size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-thin px-2 pb-2">
        {/* New chat */}
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2.5 px-2.5 h-10 rounded-lg text-text-primary text-sm hover:bg-bg-hover transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          <SquarePen size={18} className="flex-shrink-0 text-text-primary" />
          <span>New chat</span>
        </button>

        {/* Nav */}
        <nav className="mt-0.5">
          {navItems.map(({ label, Icon }) => (
            <button
              key={label}
              className="w-full flex items-center gap-2.5 px-2.5 h-10 rounded-lg text-text-primary text-sm hover:bg-bg-hover transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              <Icon size={18} className="flex-shrink-0 text-text-primary" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Recents */}
        <p className="text-[12px] text-text-muted px-2.5 pt-5 pb-1.5">Recents</p>
        <ul>
          {recentChats.map((title) => (
            <li key={title}>
              <button className="w-full flex items-center px-2.5 h-9 rounded-lg text-sm text-text-primary hover:bg-bg-hover transition-colors duration-150 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
                <span className="truncate">{title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Account footer */}
      <div className="p-2 flex-shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-bg-hover transition-colors duration-150 cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-[#4A4A4A] flex items-center justify-center flex-shrink-0 text-[11px] font-semibold text-text-primary">
            U
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-sm text-text-primary truncate">User</p>
            <p className="text-[12px] text-text-muted">Free</p>
          </div>
          <button className="flex-shrink-0 px-3 py-1.5 rounded-full bg-[#EDEDED] text-[#0D0D0D] text-[13px] font-medium hover:bg-white transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
            Upgrade
          </button>
        </div>
      </div>
    </div>
  )
}
