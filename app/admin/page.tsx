import { getChats } from '@/app/actions'
import { getAllUserIds } from '@/app/admin/actions'
import { formatDate } from '@/lib/utils'
import { SelectUserId } from '@/app/admin/components/select-user-id'

interface AdminPageProps {
  params: {},
  searchParams: { [key: string]: string | string[] | undefined },
}

export default async function AdminPage({ params, searchParams }: AdminPageProps) {
  const userIds = await getAllUserIds()
  const selectedUserId = searchParams.userId ?? userIds[0] as string
  const chats = await getChats(selectedUserId)

  if (!chats) {
    return null
  }

  return (
    <>
      <div className="flex-1 space-y-6">
        <div className="border-b bg-background px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto max-w-2xl md:px-6">
            <div className="space-y-1 md:-mx-8">
              <h1 className="text-2xl font-bold">Admin Page</h1>
              <div className="text-sm text-muted-foreground">
                {chats.length} chats
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto max-w-2xl md:px-6">
            <div className="space-y-1 md:-mx-8">
              <SelectUserId userIds={userIds} />
            </div>
          </div>
        </div>
        <div className="px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto max-w-2xl md:px-6">
            <div className="space-y-1 md:-mx-8">
              {chats.map((chat) => (
                <div key={chat.id} className="py-2 md:py-4">
                  <a
                    href={chat.sharePath}
                    className="block px-4 py-2 md:px-6 md:py-4 rounded-md hover:bg-gray-100"
                  >
                    <div className="text-lg font-bold">{chat.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(chat.createdAt)} · {chat.messages.length} messages
                    </div>
                    {chat.sharePath && (
                        <div className="text-sm text-muted-foreground">
                          Share URL: {chat.sharePath}
                        </div>
                    )}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
