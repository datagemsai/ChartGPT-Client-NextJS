"use client"

import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import config from '@/lib/config'
import { useSelector, useDispatch } from 'react-redux'
import { DataSource, selectDataSource, setDataSource } from '@/lib/redux/data-slice'

const dataSources: { [key: string]: DataSource } = config?.dataSources ?? []

export default function DataSourceSelector() {
  const dataSource: DataSource = useSelector(selectDataSource)
  const dispatch = useDispatch()

  const handleChange = (event: SelectChangeEvent) => {
    const dataSourceKey = event.target.value as string
    dispatch(setDataSource(dataSources[dataSourceKey]))
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
      <InputLabel id="data-source-selector-label">Data Source</InputLabel>
      <Select
        labelId="data-source-selector-label"
        id="data-source-selector"
        value={dataSource.dataSourceURL}
        label="Data Source"
        onChange={handleChange}
      >
        {Object.keys(dataSources).map((key) => (
            <MenuItem key={key} value={key}>{dataSources[key].dataSourceName}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
