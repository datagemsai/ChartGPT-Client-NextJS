'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'
import { IconPlus, IconArrowRight } from '@/components/ui/icons'
import { usePathname, useRouter } from 'next/navigation'

export function ButtonBackHome({ className, ...props }: ButtonProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isChat = pathname.startsWith('/chat')
  const isShare = pathname.startsWith('/share')
  const isSignIn = pathname.startsWith('/sign-in')
  
  return !isSignIn ? (
    <div className="fixed top-20 left-20 z-50 flex items-center justify-center">
      <Button
        variant="outline"
        size="icon"
        className={cn(
          'absolute right-4 top-1 z-10 bg-background transition-opacity duration-300 sm:right-8 md:top-2',
          isHome ? 'opacity-0' : 'opacity-100',
          className
        )}
        onClick={(e) => {
            e.preventDefault()
            router.refresh()
            router.push('/')
          }
        }
        {...props}
      >
        {isChat ? <IconArrowRight className='rotate-180' /> : <IconPlus />}
        <span className="sr-only">Go back home</span>
      </Button>
    </div>
  ) : null
}
