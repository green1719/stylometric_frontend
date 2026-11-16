import axios from 'axios'

interface LoginResponse {
  access_token?: string
}

interface ApiErrorResponse {
  error?: string
}

export async function loginWithPassword(userName: string, password: string): Promise<string> {
  const response = await axios.post<LoginResponse>('/api/auth/login', {
    stylometry_sample_name: userName,
    stylometry_sample_password: password,
  })

  if (!response.data.access_token) throw new Error('Сервер не вернул JWT.')
  return response.data.access_token
}

export async function logoutWithToken(accessToken: string): Promise<void> {
  await axios.post('/api/auth/logout', undefined, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export function readApiError(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.error || fallback
  }
  return error instanceof Error ? error.message : fallback
}
