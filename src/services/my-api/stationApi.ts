import { request } from 'umi';
import type { Station } from '@/pages/station/data.d';

// Lấy danh sách các ga
export async function fetchStations() {
  return request<Station[]>('/api/station/all', {
    method: 'GET',
  });
}

// Xóa ga
export async function deleteStation(id: number) {
  return request(`/api/station/${id}`, {
    method: 'DELETE',
  });
}

// Cập nhật thông tin ga
export async function updateStation(id: number, body: Station) {
  return request(`/api/station/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

// Tạo mới ga
export async function createStation(body: Station) {
  return request('/api/station', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}
