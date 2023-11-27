import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'
import { UserRole } from '@/lib/types'

export const runtime = 'edge'
export const preferredRegion = 'home'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const session = await auth()

  if (!session?.user) {
    return {}
  }

  const chat = await getChat(params.id, session.user)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect(`/sign-in?next=/chat/${params.id}`)
  }

  const chat = await getChat(params.id, session.user)

  if (!chat) {
    console.log(`Chat not found params.id: ${params.id} session.user.id: ${session.user.id}`)
    notFound()
  }

  if (session.user.role !== UserRole.admin && chat?.userId !== session?.user?.id) {
    console.log('User ID does not match')
    notFound()
  }

  return <Chat id={chat.id} initialMessages={chat.messages} />
}
