'use client'

import { useState } from 'react';
import { PromptForm } from '@/components/prompt-form';
import { EmptyScreen } from '@/components/empty-screen';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { makeStyles } from '@mui/styles';

import { publicRuntimeConfig } from 'next.config'
import { ChatPanelProps } from '@/components/chat-panel';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '400px',
    position: 'fixed',
    bottom: '2%',
    right: '2%',
    zIndex: 1000,
  },
  accordian: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    paddingRight: '2%', // To ensure scrollbar doesn't overlap content
    height: '100%',
  },
  footer: {
    background: '#ffffff',
    padding: '1%',
    marginTop: 'auto',
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center', // Align items vertically in the center
  },
  logo: {
    maxHeight: '3vh', // Adjust this value based on your needs
    paddingRight: '8px', // Space between the logo and the text
  },
}));

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
  const classes = useStyles();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={classes.root}>
      <Accordion className={classes.accordian} expanded={isExpanded} onChange={() => setIsExpanded(!isExpanded)} style={{ height: isExpanded ? '500px' : '50px' }}>
        <AccordionSummary
          expandIcon={<ExpandLessIcon />}
          aria-controls="panel-content"
          id="panel-header"
        >
        <div className={classes.flexContainer}>
          <img
            src={publicRuntimeConfig?.assistantLogo}
            alt="Property Guru Logo"
            className={classes.logo}
          />
          <Typography>{publicRuntimeConfig?.chatBotName}</Typography>
        </div>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <div className={classes.content}>
            {/* <EmptyScreen setInput={() => {}} /> */}
          </div>
          <div className={classes.footer}>
            <PromptForm
              onSubmit={async value => {
                await append({
                  id,
                  content: value,
                  role: 'user'
                });
              }}
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