import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ChatArea from './components/ChatArea'

export default function App() {
  // Remounting ChatArea clears its conversation state — restores access to the
  // suggestion chips, which now only appear on the empty state.
  const [chatKey, setChatKey] = useState(0)

  return (
    <div className="flex h-screen bg-bg-primary text-text-primary overflow-hidden">
      <Sidebar onNewChat={() => setChatKey((k) => k + 1)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <ChatArea key={chatKey} />
      </div>
    </div>
  )
}
