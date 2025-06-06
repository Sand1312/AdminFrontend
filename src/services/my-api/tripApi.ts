import { request } from 'umi';
// import type { Trip } from '@/types/Trip';
// // import type { TripAPI } from '@/pages/trip/add-trip/data'
// import type { TripAPI } from '@/pages/trip/add-trip/data'
import type {AddTripRequest} from '@/pages/trip/add-trip/data'
import type { Trip } from '@/pages/trip/trip-detail/data';

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

export async function fetchTrips() {
  const data = await request<Trip[]>('/api/trips', { method: 'GET' });
  console.log('fetchTrips response:', data);
  return data;
}

export async function fetchTripById(id: number) {
  const data = await request<Trip>(`/api/trips/${id}`, { method: 'GET' });
  console.log('fetchTripById response:', data);
  return data;
}

export async function cancelTripById(tripId: number) {
  const data = await request<any>(`/api/trips/cancelTrip/${tripId}`, { method: 'GET' });
  // console.log('fetchTripById response:', data);
  return data;
}
