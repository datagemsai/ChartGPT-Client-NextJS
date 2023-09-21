import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "@/lib/redux/store";
// import { HYDRATE } from "next-redux-wrapper";
import { publicRuntimeConfig } from 'next.config'

// Type for our state
export interface DataSource {
  dataSourceName?: string;
  dataSourceDescription?: string;
  dataSourceURL: string;
  dataProviderName?: string;
  dataProviderWebsite?: string;
  dataProviderImage?: string;
  sampleQuestions?: string[];
}

export interface DataSourceState {
  dataSource: DataSource
}

// Initial state
const defaultDataSource = Object.values(publicRuntimeConfig?.dataSources)[0] as DataSource;
const initialState: DataSourceState = {
  dataSource: defaultDataSource
}

// Actual Slice
export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setDataSource(state, action) {
      state.dataSource = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  // extraReducers: {
  //   [HYDRATE]: (state, action) => {
  //     return {
  //       ...state,
  //       ...action.payload.data,
  //     };
  //   },
  // },
});

export const { setDataSource } = dataSlice.actions;

export const selectDataSource = (state: AppState) => state.data.dataSource;

export default dataSlice.reducer;
