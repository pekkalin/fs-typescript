import express from 'express';
import {calculateBmi} from './bmicalculator.ts';
import {calculateExercises} from './exerciseCalculator.ts';
const app = express();
app.use(express.json());

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    res.status(400).send({ error: "malformatted parameters" });
  } else {
    res.send({ weight: weight, height: height, bmi: calculateBmi(height, weight) });
  }
});

app.post('/exercises', (req, res) => {
  const body: unknown = req.body;
  const { daily_exercises, target } = body as { daily_exercises: number[], target: number };
  //console.log(daily_exercises, target);
  if (!daily_exercises || !target || !daily_exercises.length) {
    res.status(400).send({ error: "parameters missing" });
  }

  if(!Array.isArray(daily_exercises) || daily_exercises.some(isNaN) || isNaN(Number(target))) {
    res.status(400).send({ error: "malformatted parameters" });
  } else {
    const result = calculateExercises([Number(target), ...daily_exercises]);
    res.send(result);
  }
});


const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});