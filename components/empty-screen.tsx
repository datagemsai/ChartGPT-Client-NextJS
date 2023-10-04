import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'
import { DataSourceCard } from '@/components/data-source-card'
import { connect } from 'react-redux'
import { DataSource, setDataSource } from '@/lib/redux/data-slice'
import config from '@/lib/config'
import { AppState } from '@/lib/redux/store'
import React from 'react'

type EmptyScreenProps = {
  dataSource: DataSource
  setInput: UseChatHelpers['setInput']
  dispatch: (arg0: any) => void
};

const mapStateToProps = (state: AppState) => {
  return {
      dataSource: state.data.dataSource
  }
}

class EmptyScreen extends React.Component<EmptyScreenProps> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const dataSources: {[key: string]: DataSource} = config?.dataSources ?? {}
    const dataSource: DataSource = this.props.dataSource
    const sampleQuestions: string[] = dataSource.sampleQuestions ?? []

    const handleSelectDataSource = (dataSource: DataSource) => {
      this.props.dispatch(setDataSource(dataSource))
    }

    return (
      <div className="mx-auto max-w-2xl px-4">
        <div className="rounded-lg bg-background p-8">
          {/* <img src="/property_guru.png" alt="Property Guru Logo" className='pb-8' /> */}
          <h1 className="mb-2 text-lg font-semibold">
            {config?.chatBotWelcomeMessage}
          </h1>
          <p className="mb-2 leading-normal text-muted-foreground">
            Start by selecting a data source:
          </p>
          {
            Object.keys(dataSources).map((key: string, index: number) => (
              <div key={index} className="mb-4">
                <DataSourceCard
                  selectDataSource={handleSelectDataSource}
                  selected={key === dataSource.dataSourceURL}
                  dataSource={dataSources[key]}
                />
              </div>
            ))
          }
          <p className="leading-normal text-muted-foreground">
            Then you can start a conversation or try the following examples:
          </p>
          <div className="mt-4 flex flex-col items-start space-y-2">
            {sampleQuestions.map((question: string, index: number) => (
              <Button
                key={index}
                variant="link"
                className="h-auto p-0 text-left text-base"
                onClick={() => this.props.setInput(question)}
              >
                <IconArrowRight className="mr-2 text-muted-foreground" />
                {question}
              </Button>
            ))}
          </div>
        </div>
      </div>
    )
  }
}
export default connect(mapStateToProps)(EmptyScreen)
