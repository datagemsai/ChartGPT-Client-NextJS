import { getChats } from "@/app/actions";
import { kv } from "@/lib/kv";
import { Chat } from "@/lib/types";


export async function getAllChats(): Promise<Chat[]> {
  const allUserIds = await getAllUserIds();
  let allChats: Chat[] = [];

  for (const userId of allUserIds) {
    const userChats = await getChats(userId);
    allChats = [...allChats, ...userChats];
  }

  allChats.sort((a, b) => {
    return (a.createdAt > b.createdAt ? -1 : 1)
  });

  return allChats;
}

export async function getAllUserIds(): Promise<string[]> {
  const userKeyPattern = 'user:chat:*';
  let cursor = 0;
  let userIds: string[] = [];

  do {
    const scanCommandOptions = {
      match: userKeyPattern,
      count: 20,
    }
    const [nextCursor, keys]: [number, string[]] = await kv.scan(cursor, scanCommandOptions);
    for (const key of keys) {
      const userId = key.split(':')[2];
      if (userId) {
        userIds.push(userId);
      }
    }
    cursor = nextCursor;
  } while (cursor !== 0);

  return userIds;
}
