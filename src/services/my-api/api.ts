import { request } from '@umijs/max';

export async function outLogin() {
  const token = localStorage.getItem('token');
  return request<Record<string, any>>('/api/doLogout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      token,
    },
  });
}

export async function login(body: API.LoginParams) {
  return request<API.LoginResult>('/api/doLogin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

export async function currentUser(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  // console.log('token', token);
  if (!token) {
    throw new Error('No token found');
  }

  const res = await request<{
    status: string;
    result: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...(options || {}),
  });

  if (res.status === 'OK') {
    return {
      data: {
        ...res.result,
        access: 'admin',
      },
    };
  }

  throw new Error('Failed to fetch user info');
}
