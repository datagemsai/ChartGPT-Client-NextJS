'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Provider } from "react-redux"
import { store } from '@/lib/redux/store'

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>
        <Provider store={store}>
          {children}
        </Provider>
      </TooltipProvider>
    </NextThemesProvider>
  )
}
