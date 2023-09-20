// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx
"use client";

import { Message } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/ui/codeblock'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { IconBot, IconUser } from '@/components/ui/icons'
import { ChatMessageActions } from '@/components/chat-message-actions'
// import Plot from 'react-plotly.js'
import dynamic from 'next/dynamic'

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

export declare type CustomMessage = {
  id: string;
  createdAt?: Date;
  content: string;
  role: 'system' | 'user' | 'assistant';
  type: string;
};

export interface ChatMessageProps {
  message: Message
}

export interface PlotlyData {
  data: [{}]
  layout: {titlefont: object}
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  const Plot = dynamic(() => import('react-plotly.js'), {
    ssr: false,
  })
  return (
    <div
      className={cn('group relative mb-4 flex items-start md:-ml-12')}
      {...props}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
          message.role === 'user'
            ? 'bg-background'
            : 'bg-background'
        )}
      >
        {message.role === 'user' ? <IconUser /> : <IconBot />}
      </div>
      <div className="flex-1 px-1 ml-4 space-y-2 overflow-hidden">
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == '▍') {
                  return (
                    <span className="mt-1 cursor-default animate-pulse">▍</span>
                  )
                }

                children[0] = (children[0] as string).replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className || '')

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              const language = (match && match[1]) || ''
              const title_primary = language
                .replace(/python/, 'Code')
                .replace(/table/, 'Table')
                .replace(/sql/, 'Query')

              const title_secondary = language
                .replace(/python/, '')
                .replace(/table/, '(Sample of 10 rows)')
                .replace(/sql/, '')

              if (children.length === 0 || !children[0]) {
                console.log('No children')
                return null
              }

              if (language === 'table') {
                console.log('Generating table')

                let pandasData: any
                try {
                  pandasData = JSON.parse(String(children[0]))
                } catch (error) {
                  console.log(`Error parsing JSON: ${error}`)
                  return null
                }
  
                const firstRow = pandasData?.[0];
                const rows: GridRowsProp = pandasData 
                  ? pandasData.map((row: any, index: number) => ({ id: index, ...row }))
                  : [];
                const columns: GridColDef[] = firstRow 
                  ? Object.keys(firstRow).map(key => ({ field: key, headerName: key, width: 150 }))
                  : [];
                return (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography className='pr-4'>
                        {title_primary}
                      </Typography>
                      <Typography sx={{ color: 'text.secondary'}}>{title_secondary}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <DataGrid rows={rows} columns={columns} />
                    </AccordionDetails>
                  </Accordion>
                )
              } else if (language === 'python' || language === 'sql') {
                console.log('Generating code block')
                return (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography className='pr-4'>
                        {title_primary}
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>{title_secondary}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <CodeBlock
                        key={Math.random()}
                        language={language}
                        value={String(children).replace(/\n$/, '')}
                        {...props}
                      />
                    </AccordionDetails>
                  </Accordion>
                )
              } else if (language === 'chart') {
                console.log('Generating chart')
                
                let plotlyData: PlotlyData
                try {
                  plotlyData = JSON.parse(typeof children[0] === 'string' ? children[0] : String(children[0]))
                } catch (error) {
                  console.log(`Error parsing JSON: ${error}`)
                  return null
                }

                return (
                  <Plot
                    data={plotlyData.data}
                    layout={{
                      ...plotlyData.layout,
                      titlefont: {
                        ...plotlyData.layout.titlefont,
                        size: 14,
                      }
                    }}
                    useResizeHandler={true}
                    style={{width: "100%", height: "100%"}}
                  />
                )
              } else {
                console.log(`Unhandled language: ${language}`)
                return null
              }
            },
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
        <ChatMessageActions message={message} />
      </div>
    </div>
  )
}
