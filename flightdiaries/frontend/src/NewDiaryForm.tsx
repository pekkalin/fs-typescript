import { useState } from 'react';
import axios from 'axios';
import type { DiaryEntry, NewDiaryEntry, Weather, Visibility } from './types';
import { create } from './diaryService';

interface Props {
  onEntryAdded: (entry: DiaryEntry) => void;
}

const NewDiaryForm = ({ onEntryAdded }: Props) => {
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather>('sunny');
  const [visibility, setVisibility] = useState<Visibility>('great');
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: NewDiaryEntry = { date, weather, visibility, comment };
    try {
      const added = await create(newEntry);
      onEntryAdded(added);
      setDate('');
      setWeather('sunny');
      setVisibility('great');
      setComment('');
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        if (typeof data === 'string') {
          setError(data);
        } else if (data?.error) {
          const messages = Array.isArray(data.error)
            ? data.error.map((i: { message: string }) => i.message).join(', ')
            : String(data.error);
          setError(messages);
        } else {
          setError(err.message);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add new entry</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        date <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>
      <div>
        weather{' '}
        {(['sunny', 'rainy', 'cloudy', 'stormy', 'windy'] as Weather[]).map(w => (
          <label key={w}>
            <input
              type="radio"
              name="weather"
              value={w}
              checked={weather === w}
              onChange={() => setWeather(w)}
            />
            {w}
          </label>
        ))}
      </div>
      <div>
        visibility{' '}
        {(['great', 'good', 'ok', 'poor'] as Visibility[]).map(v => (
          <label key={v}>
            <input
              type="radio"
              name="visibility"
              value={v}
              checked={visibility === v}
              onChange={() => setVisibility(v)}
            />
            {v}
          </label>
        ))}
      </div>
      <div>
        comment <input value={comment} onChange={e => setComment(e.target.value)} />
      </div>
      <button type="submit">add</button>
    </form>
  );
};

export default NewDiaryForm;
