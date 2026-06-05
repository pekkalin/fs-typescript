
import express from 'express';
import cors from 'cors';
import { v1 as uuid } from 'uuid';

import type { Diagnose, Patient, NewPatient } from './types.ts';
import { NewPatientSchema } from './types.ts';

import diagnoses from './data/diagnoses.ts';
import patients from './data/patients.ts';

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
  res.json(diagnoses);
});

app.get('/api/patients', (_req, res) => {
  const patientsWithoutSSN: PatientWithoutSSN[] = patients.map(({ ssn: _ssn, ...rest }) => rest);
  res.json(patientsWithoutSSN);
});

app.post('/api/patients', (req, res) => {
  const result = NewPatientSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: 'Invalid patient data',
      issues: result.error.issues,
    });
    return;
  }

  const newPatientEntry: NewPatient = result.data;

  const newPatient: Patient = {
    id: uuid(),
    ...newPatientEntry,
  };

  patients.push(newPatient);

  res.json(newPatient);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});