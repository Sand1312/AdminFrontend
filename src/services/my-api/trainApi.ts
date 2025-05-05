import type { TrainResponse } from '@/pages/trip/add-trip/data';
import { request } from '@umijs/max';

export async function getAllTrain() {
  return request<TrainResponse[]>('/api/train/all', {
    method: 'GET',
  });
}
