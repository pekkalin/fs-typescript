export const Gender = {
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