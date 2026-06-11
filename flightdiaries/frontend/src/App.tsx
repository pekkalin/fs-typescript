import { useEffect, useState } from 'react';
import type { DiaryEntry } from './types';
import { getAll } from './diaryService';
import NewDiaryForm from './NewDiaryForm';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAll().then(data => setDiaries(data));
  }, []);

  return (
    <div>
      <NewDiaryForm onEntryAdded={entry => setDiaries(diaries.concat(entry))} />
      <h2>Diary entries</h2>
      {diaries.map(diary => (
        <div key={diary.id}>
          <strong>{diary.date}</strong>
          <ul>
            <li>weather: {diary.weather}</li>
            <li>visibility: {diary.visibility}</li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default App;
