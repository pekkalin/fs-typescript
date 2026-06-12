/**
 * export const Gender = {
  Male: 'male',
  Female: 'female',
  Other: 'other',
} as const;

export type Gender = typeof Gender[keyof typeof Gender];
export type NewPatient = Omit<Patient, 'id'>;


export type Patient = {
    id: string;
    name: string;
    dateOfBirth: string;
    ssn: string;
    gender: string;
    occupation: string;
};

export type Diagnose = {
  code: string;
  name: string;
  latin?: string;
};
**/
import { z } from 'zod';

export const Gender = {
  Male: 'male',
  Female: 'female',
  Other: 'other',
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Entry {
}

export interface Patient {
  id: string;
  name: string;
  ssn: string;
  occupation: string;
  gender: Gender;
  dateOfBirth: string;
  entries: Entry[];
}

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;

export type NewPatient = Omit<Patient, 'id'>;

export type Diagnose = {
  code: string;
  name: string;
  latin?: string;
};

export const NewPatientSchema = z.object({
  name: z.string().min(1),
  dateOfBirth: z.string().date(),
  ssn: z.string().min(1),
  gender: z.enum(Gender),
  occupation: z.string().min(1),
});

export type NewPatientSchemaType = z.infer<typeof NewPatientSchema>;