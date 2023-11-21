'use client'

import React, { useState, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import dynamic from 'next/dynamic'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


export function ChartGalleryRow() {
  const Plot = dynamic(() => import('react-plotly.js'), {
    ssr: false,
    loading: () => <Skeleton width={600} height={400} />
  })

  const [items, setItems] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [page])

  const fetchItems = async () => {
    const res = await fetch(`/api/charts?page=${page}&limit=5`)
    if (res.status !== 200) {
      console.log('Error: ' + res.status)
      return
    }
    const data = await res.json()
    setItems([...items, ...data.responses])
    setHasMore(data.currentPage < data.totalPages)
  }

  return (
    <div className="w-full py-4">
      <div id="scrollableDiv" className="flex flex-nowrap gap-2.5 mx-auto style={{ maxHeight: '400px' }} overflow-scroll">
        <InfiniteScroll
          dataLength={items.length}
          next={() => setPage(page + 1)}
          hasMore={hasMore}
          loader={(
            <div className="grid-item min-w-[600px] px-4">
              {
                <div className="title-container" style={{ minHeight: '5rem' }}>
                  <p className="py-2 text-lg font-semibold">Loading...</p>
                </div>
              }
              <Skeleton width={600} height={400} />
            </div>
          )}
          // endMessage={}
          style={{ display: 'flex', flexDirection: 'row' }}
          scrollableTarget="scrollableDiv"
        >
            {items.map((item: any, index: any) => {
                const title = item.messages[item.messages.length - 1].content.slice(0, 140)
                const plotlyData = JSON.parse(item.outputs.filter((output: { type: string }) => output.type === 'plotly_chart')[0].value)

                return (
                  <div key={index} className="grid-item min-w-[600px] px-4">
                    <div className="title-container" style={{ minHeight: '5rem' }}>
                      <p className="py-2 text-lg font-semibold">“{title}”</p>
                    </div>
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
                      style={{ width: "auto", height: "400px" }}
                    />
                  </div>
                )
              }
            )}
        </InfiniteScroll>
      </div>
    </div>
  )
}

// export function ChartGalleryGrid() {
//   const Plot = dynamic(() => import('react-plotly.js'), {
//     ssr: false,
//   })

//   const [items, setItems] = useState<any[]>([])
//   const [page, setPage] = useState(1)
//   const [hasMore, setHasMore] = useState(true)

//   useEffect(() => {
//     fetchItems()
//   }, [page])

//   const fetchItems = async () => {
//     const res = await fetch(`/api/charts?page=${page}&limit=5`)
//     if (res.status !== 200) {
//       console.log('Error: ' + res.status)
//       return
//     }
//     const data = await res.json()
//     setItems([...items, ...data.responses])
//     setHasMore(data.currentPage < data.totalPages)
//   }

//   return (
//     <div className="mx-auto max-w-2xl px-4">
//       <InfiniteScroll
//         dataLength={items.length}
//         next={() => setPage(page + 1)}
//         hasMore={hasMore}
//         loader={<h4>Loading charts...</h4>}
//         // endMessage={}
//       >
//         <div className="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-2.5">
//           {items.map((item, index) => {
//               const title = item.messages[item.messages.length-1].content.slice(0, 140)
//               const plotlyData = JSON.parse(item.outputs.filter(output => output.type === 'plotly_chart')[0].value)
              
//               return (
//                 <div key={index} className="grid-item">
//                   <p>{title}</p>
//                   <Plot
//                     data={plotlyData.data}
//                     layout={{
//                       ...plotlyData.layout,
//                       titlefont: {
//                         ...plotlyData.layout.titlefont,
//                         size: 14,
//                       }
//                     }}
//                     useResizeHandler={true}
//                     style={{width: "100%", height: "100%"}}
//                   />
//                 </div>
//               )
//             }
//           )}
//         </div>
//       </InfiniteScroll>
//     </div>
//   )
// }
