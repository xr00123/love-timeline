import { useState, useRef, useEffect } from 'react'
import { searchMemories } from '@/api/client'
import type { SearchHitRead } from '@/api/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Send, Bot, User, Sparkles } from 'lucide-react'

type Props = {
  onOpen: (id: string) => void
}

type Message = {
  id: string
  role: 'user' | 'ai'
  content: string
  memories?: SearchHitRead[]
}

export function SearchView(props: Props) {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: '你好！我是你的记忆助手。想找回什么记忆？告诉我，我来帮你回忆。'
    }
  ])
  const [loading, setLoading] = useState(false)
  
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
     const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
     if (viewport) {
         viewport.scrollTop = viewport.scrollHeight;
     }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  async function handleSend() {
    if (!query.trim() || loading) return
    
    const userText = query.trim()
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText
    }
    
    setMessages(prev => [...prev, userMsg])
    setQuery('')
    setLoading(true)

    try {
      const results = await searchMemories(userText, 5)
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: results.length > 0 
          ? `我为你找到了 ${results.length} 段相关的记忆：`
          : '抱歉，我没有找到相关的记忆。要不换个说法试试？',
        memories: results
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (e: unknown) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: '抱歉，读取记忆时出了一点小差错。'
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full max-w-4xl mx-auto bg-background/50 backdrop-blur-sm rounded-xl border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b bg-muted/30 flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
                <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium">记忆助手</span>
        </div>

        {/* Chat Area */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-6 pb-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <Avatar className="w-8 h-8 mt-1">
                            {msg.role === 'ai' ? (
                                <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="w-4 h-4" /></AvatarFallback>
                            ) : (
                                <AvatarFallback className="bg-muted"><User className="w-4 h-4" /></AvatarFallback>
                            )}
                        </Avatar>
                        
                        <div className={`flex flex-col gap-2 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                                msg.role === 'user' 
                                    ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                                    : 'bg-white border rounded-tl-sm'
                            }`}>
                                {msg.content}
                            </div>
                            
                            {msg.memories && msg.memories.length > 0 && (
                                <div className="grid gap-2 w-full mt-1">
                                    {msg.memories.map(m => (
                                        <Card 
                                            key={m.memory_id} 
                                            className="cursor-pointer hover:bg-accent/50 transition-colors border-l-4 border-l-primary group"
                                            onClick={() => props.onOpen(m.memory_id)}
                                        >
                                            <CardContent className="p-3">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div className="flex flex-wrap gap-1">
                                                        {m.tags.slice(0, 3).map(t => (
                                                            <span key={t} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-md text-secondary-foreground font-medium">
                                                                #{t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                                        匹配度 {(m.distance ? (1 - m.distance) * 100 : 0).toFixed(0)}%
                                                    </span>
                                                </div>
                                                <div className="text-sm text-foreground/90 line-clamp-2 group-hover:text-primary transition-colors">
                                                    {m.content_preview}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                         <Avatar className="w-8 h-8 mt-1">
                            <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="w-4 h-4" /></AvatarFallback>
                        </Avatar>
                        <div className="bg-white border px-4 py-3 rounded-2xl rounded-tl-sm text-sm text-muted-foreground flex items-center gap-1 shadow-sm w-fit">
                            <span>正在回忆中</span>
                            <span className="flex gap-1 ml-1">
                                <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex gap-2 max-w-4xl mx-auto">
                <Input 
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="输入关键词，例如：第一次旅行..."
                    className="flex-1"
                    disabled={loading}
                    autoFocus
                />
                <Button onClick={handleSend} disabled={loading || !query.trim()} size="icon" className="shrink-0">
                    <Send className="w-4 h-4" />
                    <span className="sr-only">发送</span>
                </Button>
            </div>
        </div>
    </div>
  )
}

