'use client';

import { Action, PayloadAction } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { CEnv } from '../../types/env';
import { RootState } from '../store';

type BaseQueryType = ReturnType<typeof fetchBaseQuery>;

export const baseQueryWithReauth: (baseQuery: BaseQueryType) => BaseQueryType = (baseQuery) => async (args, api, extraOptions) => {
  let result: any = await baseQuery(args, api, extraOptions);

  //   if (!(api.getState() as RootState).initPage.logoutStatus) {
  //     if (result.error && (api.getState() as RootState).initPage.initPageStatus === EInitPageStatus.COMPLETED) {
  //       if (result.error.data?.MessageCode) AlertError(translate(result?.error?.data?.MessageCode));
  //       else if (result.error.data?.ErrorCode) AlertError(ErrorUtils.translateErrorCode(result?.error?.data?.ErrorCode, result?.error?.data?.Message));
  //     }
  //   }

  return result;
};

function isHydrateAction(action: Action): action is PayloadAction<RootState> {
  return action.type === HYDRATE;
}

// --------------------------------

const customMainBaseQuery = fetchBaseQuery({
  baseUrl: CEnv.URL_API_MAIN_SIDE || '',
  //   validateStatus: (response, result) => {
  //     return !((result?.ErrorCode && result?.ErrorCode !== EErrCode.SUCCESS) || result?.MessageCode);
  //   },
  prepareHeaders: (headers, { getState }) => {
    // headers.set('authorization', `Bearer ${CookieUtils.get(ECookieVariable.TOKEN)}`);
    // headers.set('domain', `${CEnv.DOMAIN_CODE}`);

    return headers;
  },
});

export const customMainAPI = createApi({
  refetchOnFocus: true,
  reducerPath: 'mainAPI',
  baseQuery: baseQueryWithReauth(customMainBaseQuery),
  extractRehydrationInfo(action, { reducerPath }): any {
    if (isHydrateAction(action)) {
      return action.payload[reducerPath];
    }
  },
  endpoints: () => ({}),
});
