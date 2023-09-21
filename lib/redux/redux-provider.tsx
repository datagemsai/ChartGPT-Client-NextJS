"use client"

import React from "react"
import { Provider } from "react-redux"
import { store } from '@/lib/redux/store'

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}

// import React from "react"
// import { wrapper } from "@/lib/redux/store"

// function ReduxProvider({ children }: { children: React.ReactNode }) {
//   return {children}
// }
// export default(wrapper.withRedux(ReduxProvider))

