import config from '@/lib/config'
import { DataSource } from '@/lib/redux/data-slice'


export function DataSources() {
  const dataSources: { [key: string]: DataSource } = config?.dataSources ?? {}

  return (
    <div className="-mx-2 flex flex-wrap">
      {
        Object.keys(dataSources).map((key: string, index: number) => (
          <div key={index} className="mb-4 w-full px-2 md:w-1/2 lg:w-1/3">
            <div className="flex h-full items-start overflow-hidden rounded-lg">
              {/* <div className="flex-shrink-0">
                <img
                  className="h-16 w-16 object-cover mr-4"
                  src={dataSources[key].dataProviderImage}
                  alt={dataSources[key].dataProviderName}
                />
              </div> */}
              <div className="pb-4 pt-2">
                <h3 className="text-lg font-semibold">{dataSources[key].dataSourceName}</h3>
                <h4 className="text-m text-gray-600">{dataSources[key].dataProviderName}</h4>
                <p className="mt-1 text-sm text-gray-600">{dataSources[key].dataSourceDescription}</p>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}
