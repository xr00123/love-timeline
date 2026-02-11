import { useMemo, useState } from 'react'

import { MemoryDetailDrawer } from './components/MemoryDetail'
import Header, { type TabKey } from './components/Header'
import { HomeView } from './views/HomeView'
import { RecordView } from './views/RecordView'
import { SearchView } from './views/SearchView'
import { SettingsView } from './views/SettingsView'
import { TimelineView } from './views/TimelineView'

function App() {
  const [tab, setTab] = useState<TabKey>('home')
  const [openId, setOpenId] = useState<string | null>(null)

  const content = useMemo(() => {
    if (tab === 'home') return <HomeView />
    if (tab === 'timeline') return <TimelineView onOpen={(id) => setOpenId(id)} />
    if (tab === 'record') return <RecordView />
    if (tab === 'search') return <SearchView onOpen={(id) => setOpenId(id)} />
    return <SettingsView />
  }, [tab])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFF5F5] to-[#F0F7FF] font-sans text-gray-800 selection:bg-[#9C6C53] selection:text-white overflow-hidden flex flex-col">
      {/* Background Gradient Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-200/10 rounded-full blur-[100px] pointer-events-none" />

      <Header activeTab={tab} onTabChange={setTab} />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-0 flex flex-col">
        {content}
      </main>

      <MemoryDetailDrawer memoryId={openId} onClose={() => setOpenId(null)} />
    </div>
  )
}

export default App
