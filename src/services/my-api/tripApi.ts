import { request } from 'umi';
// import type { Trip } from '@/types/Trip';
// // import type { TripAPI } from '@/pages/trip/add-trip/data'
// import type { TripAPI } from '@/pages/trip/add-trip/data'
import type {AddTripRequest} from '@/pages/trip/add-trip/data'

export async function addTrip(body: AddTripRequest) {
  return request<{
    success: boolean;
    data: any;
    message: string;
  }>('/api/trips/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body, // không cần wrap trong `data: { data: body }`
  });
}