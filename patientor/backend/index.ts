import express from 'express';
import cors from 'cors';
import { v1 as uuid } from 'uuid'
import type { Diagnose, Patient, NewPatient } from './types.ts';
import diagnoses from './data/diagnoses.ts';
import patients from './data/patients.ts';
import { toNewPatientEntry } from './utils.ts';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

type PatientWithoutSSN = Omit<Patient, 'ssn'>;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.get('/api/diagnoses', (_req, res) => {
   res.json(diagnoses as Diagnose[]);
});

app.get('/api/patients', (_req, res) => {
  const patientsWithoutSSN: PatientWithoutSSN[] = patients.map(({ ssn, ...rest }) => rest);
  res.json(patientsWithoutSSN);
});

app.post('/api/patients', (req, res) => {
  try {
    const newPatientEntry: NewPatient = toNewPatientEntry(req.body);

    const newPatient: Patient = {
      id: uuid(),
      ...newPatientEntry,
    };

    patients.push(newPatient);

    res.json(newPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';

    if (error instanceof Error) {
      errorMessage += ` Error: ${error.message}`;
    }

    res.status(400).send(errorMessage);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});