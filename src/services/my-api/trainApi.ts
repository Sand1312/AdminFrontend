import { AddTrainResponse, UpdateTrainResponse } from '@/pages/train/data';
import type { TrainResponse } from '@/pages/trip/add-trip/data';
import { request } from '@umijs/max';
import axios from 'axios';

export async function addTrainAxios(body: AddTrainResponse) {
  return axios.post('/api/train/add', body, {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function getAllTrain() {
  return request<TrainResponse[]>('/api/train/all', {
    method: 'GET',
  });
}


export async function addTrain(body: AddTrainResponse) {
  return request<{
    success: boolean;
    data: any;
    message: string;
  }>('/api/train/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body, // không cần wrap trong `data: { data: body }`
  });
}

export async function updateTrain(body: UpdateTrainResponse) {
  return request<{
    success: boolean;
    data: any;
    message: string;
  }>('/api/train/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body, // không cần wrap trong `data: { data: body }`
  });
}

export async function updateTrainAxios(body: UpdateTrainResponse) {
  return axios.put('/api/train/update', body, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}