'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"

interface Props {
  userIds: string[]
}

export function SelectUserId({ userIds } : Props) {
  const router = useRouter()
  const [selectedUserId, setSelectedUserId] = useState(userIds[0])

  return (
    <select
      value={selectedUserId}
      onChange={(e) => {
        setSelectedUserId(e.target.value)
        e.preventDefault()
        router.push(`/admin/?userId=${e.target.value}`)
      }}
    >
      {userIds.map((userId) => (
        <option key={userId} value={userId}>
          {userId}
        </option>
      ))}
    </select>
  )
}