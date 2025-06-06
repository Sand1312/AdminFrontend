import { request } from 'umi';
import type { TrainSchedule } from '@/pages/trainschedule/data.d';
import type { Station } from '@/pages/station/data.d';

export async function fetchStations() {
  return request<Station[]>('/api/station/all', {
    method: 'GET',
  });
}
// Lấy danh sách lịch tàu
export async function fetchTrainSchedules() {
  return request<TrainSchedule[]>('/api/train-schedules', {
    method: 'GET',
  });
}

// Xóa lịch tàu
export async function deleteTrainSchedule(id: number) {
  return request(`/api/train-schedules/${id}`, {
    method: 'DELETE',
  });
}

// Cập nhật lịch tàu
export async function updateTrainSchedule(id: number, body: any) {
  return request(`/api/train-schedules/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

// Tạo mới lịch tàu
export async function createTrainSchedule(body: any) {
  return request('/api/train-schedules', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}
