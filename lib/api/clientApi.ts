import { api } from './api';
import type { Note, NoteTag } from '@/types/note';
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

export interface CreateNoteData {
  title: string;
  content?: string;
  tag: NoteTag;
}

interface AuthData {
  email: string;
  password: string;
}

export async function fetchNotes(params: FetchNotesParams): Promise<FetchNotesResponse> {
  const response = await api.get<FetchNotesResponse>('/notes', { params });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function createNote(data: CreateNoteData): Promise<Note> {
  const response = await api.post<Note>('/notes', data);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
}

export async function register(data: AuthData): Promise<User> {
  const response = await api.post<User>('/auth/register', data);
  return response.data;
}

export async function login(data: AuthData): Promise<User> {
  const response = await api.post<User>('/auth/login', data);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function checkSession(): Promise<{ success: boolean }> {
  const response = await api.get<{ success: boolean }>('/auth/session');
  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>('/users/me');
  return response.data;
}

export async function updateMe(data: Partial<Pick<User, 'username'>>): Promise<User> {
  const response = await api.patch<User>('/users/me', data);
  return response.data;
}
