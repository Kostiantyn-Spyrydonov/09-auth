import { cookies } from 'next/headers';
import type { AxiosResponse } from 'axios';
import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.toString();
}

export async function fetchNotes(params: FetchNotesParams): Promise<FetchNotesResponse> {
  const cookieHeader = await getCookieHeader();
  const response = await api.get<FetchNotesResponse>('/notes', {
    params,
    headers: { Cookie: cookieHeader },
  });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieHeader = await getCookieHeader();
  const response = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieHeader },
  });
  return response.data;
}

export async function getMe(): Promise<User> {
  const cookieHeader = await getCookieHeader();
  const response = await api.get<User>('/users/me', {
    headers: { Cookie: cookieHeader },
  });
  return response.data;
}

export async function checkSession(): Promise<AxiosResponse<{ success: boolean }>> {
  const cookieHeader = await getCookieHeader();
  const response = await api.get<{ success: boolean }>('/auth/session', {
    headers: { Cookie: cookieHeader },
  });
  return response;
}
