import * as React from 'react';
import Box from '@mui/material/Box';
import { DataSource } from '@/lib/redux/data-slice';
import { ExternalLink } from '@/components/external-link'

import {
    Card,
    CardContent,
    Typography,
    CardActionArea,
    Link,
    Avatar
  } from '@mui/material';

interface DataSourceCardProps {
    dataSource: DataSource,
    selected: boolean,
    selectDataSource: (dataSource: DataSource) => void
}

export function DataSourceCard({ dataSource, selected, selectDataSource }: DataSourceCardProps) {
    return (
        <Card sx={{ position: 'relative' }} raised={selected}>
            <CardActionArea onClick={() => selectDataSource(dataSource)}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {dataSource.dataSourceName}
                </Typography>
                <Typography variant="body2">
                    {dataSource.dataSourceDescription}
                    <br />
                    {/* {dataSource.dataProviderWebsite && (
                        <ExternalLink href={dataSource.dataProviderWebsite}>
                            Provided by {dataSource.dataProviderName}.
                        </ExternalLink>
                    )} */}
                </Typography>
            </CardContent>
            </CardActionArea>
            {/* {dataSource.dataProviderImage && (
                <Avatar
                    src={dataSource.dataProviderImage}
                    alt="Data Provider"
                    variant="square"
                    sx={{
                        width: 32,
                        height: 32,
                        position: 'absolute',
                        top: 8,
                        right: 8
                    }}
                />
            )} */}
      </Card>
    )
}