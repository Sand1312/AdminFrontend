import { request } from '@umijs/max';

export async function getAllUsers(): Promise<{ data: API.User[] }> {
  const res = await request('api/users', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  // console.log('raw response', res);
  return { data: res };
}
