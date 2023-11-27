import { ChartGalleryRow } from '@/components/chart-gallery'
import { DataSources } from '@/components/data-sources'
import config from '@/lib/config'

// export const runtime = 'edge'

export default function IndexPage() {
  return (
    <div>
      <div className="flex h-fit w-full flex-col items-center justify-center p-8 md:my-40">
        {/* <h1 className="px-2 text-6xl font-bold text-black">ChartGPT</h1> */}
        <a href="/">
          <img src={config.headerLogo} alt="Logo" className="mx-auto hidden h-40 md:block" />
        </a>
        <p className="mt-3 px-2 text-2xl text-black">Discover insights using data-driven conversations.</p>
        <div className="mt-12 flex w-full flex-col items-center justify-center">
          <a href="/chat" className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
            Start a conversation
          </a>
        </div>
      </div>
      <div className="flex h-auto w-full flex-col items-start justify-start p-8">
        <h2 className="text-2xl font-bold text-gray-800">Latest Insights</h2>
        <ChartGalleryRow />
      </div>
      <div className="flex h-auto w-full flex-col items-start justify-start p-8">
        <h2 className="py-4 text-2xl font-bold text-gray-800">Browse Data Sources</h2>
        <DataSources />
      </div>
    </div>
  )
}
