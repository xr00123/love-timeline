import './App.css'

import { useMemo, useState } from 'react'

import { MemoryDetailDrawer } from './components/MemoryDetail'
import { RecordView } from './views/RecordView'
import { SearchView } from './views/SearchView'
import { SettingsView } from './views/SettingsView'
import { TimelineView } from './views/TimelineView'

type TabKey = 'record' | 'timeline' | 'search' | 'settings'

function App() {
  const [tab, setTab] = useState<TabKey>('record')
  const [openId, setOpenId] = useState<string | null>(null)

  const content = useMemo(() => {
    if (tab === 'record') return <RecordView />
    if (tab === 'timeline') return <TimelineView onOpen={(id) => setOpenId(id)} />
    if (tab === 'search') return <SearchView onOpen={(id) => setOpenId(id)} />
    return <SettingsView />
  }, [tab])

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">爱情时光手册</div>
        <div className="tabs">
          <button className={tab === 'record' ? 'tab active' : 'tab'} onClick={() => setTab('record')}>
            录入
          </button>
          <button className={tab === 'timeline' ? 'tab active' : 'tab'} onClick={() => setTab('timeline')}>
            时间线
          </button>
          <button className={tab === 'search' ? 'tab active' : 'tab'} onClick={() => setTab('search')}>
            检索
          </button>
          <button className={tab === 'settings' ? 'tab active' : 'tab'} onClick={() => setTab('settings')}>
            设置
          </button>
        </div>
      </div>
      <div className="main">{content}</div>
      <MemoryDetailDrawer memoryId={openId} onClose={() => setOpenId(null)} />
    </div>
  )
}

export default App
