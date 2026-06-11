import axios from 'axios';
import type { DiaryEntry, NewDiaryEntry } from './types';

const baseUrl = '/api/diaries';

export const getAll = async (): Promise<DiaryEntry[]> => {
  const response = await axios.get<DiaryEntry[]>(baseUrl);
  return response.data;
};

export const create = async (entry: NewDiaryEntry): Promise<DiaryEntry> => {
  const response = await axios.post<DiaryEntry>(baseUrl, entry);
  return response.data;
};
