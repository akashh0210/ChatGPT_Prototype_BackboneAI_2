import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ChatArea from './components/ChatArea'

export default function App() {
  return (
    <div className="flex h-screen bg-bg-primary text-text-primary overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <ChatArea />
      </div>
    </div>
  )
}
