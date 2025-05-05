import { RouteResponse } from '@/pages/train/data';
import type { TrainResponse } from '@/pages/trip/add-trip/data';
import { request } from '@umijs/max';

export async function getAllRoute() {
  return request<RouteResponse[]>('/api/route/all', {
    method: 'GET',
  });
}
