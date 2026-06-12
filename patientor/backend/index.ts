
import express from 'express';
import cors from 'cors';
import { v1 as uuid } from 'uuid';

import type { Patient, NonSensitivePatient } from './types.ts';
import { NewPatientSchema, NewEntrySchema } from './types.ts';

import diagnoses from './data/diagnoses.ts';
import patients from './data/patients.ts';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.get('/api/diagnoses', (_req, res) => {
  res.json(diagnoses);
});

app.get('/api/patients', (_req, res) => {
  const nonSensitivePatients: NonSensitivePatient[] = patients.map(
    ({ ssn: _ssn, entries: _entries, ...rest }) => rest
  );
  res.json(nonSensitivePatients);
});

app.get('/api/patients/:id', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (patient) {
    res.json(patient);
  } else {
    res.status(404).json({ error: 'Patient not found' });
  }
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

  const newPatient: Patient = {
    id: uuid(),
    ...result.data,
    entries: [],
  };

  patients.push(newPatient);

  res.json(newPatient);
});

app.post('/api/patients/:id/entries', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) {
    res.status(404).json({ error: 'Patient not found' });
    return;
  }

  const result = NewEntrySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.issues });
    return;
  }

  const newEntry = { id: uuid(), ...result.data };
  patient.entries.push(newEntry);
  res.status(201).json(newEntry);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});