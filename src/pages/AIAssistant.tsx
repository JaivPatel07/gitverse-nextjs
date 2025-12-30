'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { MessageSquare, Code, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AIChatInterface } from '@/components/ai/AIChatInterface'
import { CodeAnalysisPanel } from '@/components/ai/CodeAnalysisPanel'

type TabType = 'chat' | 'analysis'

export default function AIAssistant() {
  const [activeTab, setActiveTab] = useState<TabType>('chat')

  // Mock repository context - in a real app, this would come from props or route params
  const repositoryContext = {
    name: 'GitVerse',
    description: 'A modern repository visualization and analysis platform',
    languages: ['TypeScript', 'JavaScript', 'CSS', 'HTML'],
    stats: {
      commits: 456,
      contributors: 8,
      files: 127,
    },
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="glass p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">AI Assistant</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Get intelligent insights and code analysis powered by Gemini AI
            </p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="glass rounded-lg p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap
                ${
                  activeTab === 'chat'
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'hover:bg-white/10 text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Chat Assistant</span>
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap
                ${
                  activeTab === 'analysis'
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'hover:bg-white/10 text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Code className="h-4 w-4" />
              <span>Code Analysis</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="animate-fade-in-up">
          {activeTab === 'chat' ? (
            <div className="glass rounded-lg h-[calc(100vh-300px)] flex flex-col">
              <AIChatInterface repositoryContext={repositoryContext} />
            </div>
          ) : (
            <CodeAnalysisPanel />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
