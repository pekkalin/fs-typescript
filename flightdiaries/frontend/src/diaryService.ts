import axios from 'axios';
import type { DiaryEntry } from './types';

const baseUrl = '/api/diaries';

export const getAll = async (): Promise<DiaryEntry[]> => {
  const response = await axios.get<DiaryEntry[]>(baseUrl);
  return response.data;
};
