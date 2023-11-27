'use client'

import { useState } from 'react';
import { PromptForm } from '@/components/prompt-form';
import EmptyScreen from '@/components/empty-screen';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import config from '@/lib/config'
import { ChatPanelProps } from '@/components/chat-panel';

export function ChatWidget({
  id,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages
}: ChatPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-96 fixed bottom-2 right-2 z-50">
      <Accordion className="flex flex-col h-full" expanded={isExpanded} onChange={() => setIsExpanded(!isExpanded)} style={{ height: isExpanded ? '500px' : '50px' }}>
        <AccordionSummary
          expandIcon={<ExpandLessIcon />}
          aria-controls="panel-content"
          id="panel-header"
        >
        <div className="flex items-center">
          <img
            src={config?.assistantLogo}
            alt="Logo"
            className="max-h-[3vh] pr-2"
          />
          <Typography>{config?.chatBotName}</Typography>
        </div>
        </AccordionSummary>
        <AccordionDetails className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto pr-2 h-full">
            {/* <EmptyScreen setInput={() => {}} /> */}
          </div>
          <div className="bg-white p-1 mt-auto">
            <PromptForm
              onSubmit={async value => {
                await append({
                  id,
                  content: value,
                  role: 'user'
                });
              }}
              stop={stop}
              input={input}
              setInput={setInput}
              isLoading={isLoading}
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default ChatWidget;