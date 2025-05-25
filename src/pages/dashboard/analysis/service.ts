import { request } from '@umijs/max';
import type { AnalysisData } from './data';

export async function fakeChartData(): Promise<{ data: AnalysisData }> {
  return request('/api/fake_analysis_chart_data');
}

// export default {
//   request: {
//     dataField: '',
//   },
// };

export async function getTotalRevenue(): Promise<{ data: number }> {
  // return request('api/tickets/total-revenue', {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // });

  const res = await request('api/tickets/total-revenue', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return { data: res };
  // try {
  //   const res = await request('api/tickets/total-revenue', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });
  //   console.log('Response from API:', res);
  //   return res;
  // } catch (error) {
  //   console.error('failed', error);
  //   throw error;
  // }
}
export async function getSalesFromTo(
  body: API.DateRangeParam,
): Promise<{ data: API.VisitDataType[] }> {
  const res = await request('api/tickets/from-to', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
  console.log('raw response', res);
  return { data: res };
}

export async function getRoutesRanking(): Promise<{ data: API.RankingRoutes[] }> {
  const res = await request('/api/tickets/ticket-summary', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  // console.log('raw response', res);
  return { data: res };
  // return res.data;
}

export async function getTicketsCountByType(): Promise<{ data: API.TicketsCountByType[] }> {
  const res = await request('api/tickets/count-by-type', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  // console.log('raw response', res);
  return { data: res };
}
export async function getUsersRanking(): Promise<{ data: API.RankingUsers[] }> {
  const res = await request('api/customers/ticket-summary', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  // console.log('raw response', res);
  return { data: res };
}
