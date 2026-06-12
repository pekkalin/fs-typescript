import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";

import { Patient, Gender, Entry } from "../../types";
import patientService from "../../services/patients";

const GenderIcon = ({ gender }: { gender: Gender }) => {
  switch (gender) {
    case Gender.Male:
      return <MaleIcon />;
    case Gender.Female:
      return <FemaleIcon />;
    default:
      return <TransgenderIcon />;
  }
};

const EntryDetails = ({ entry }: { entry: Entry }) => (
  <Box sx={{ mb: 2 }}>
    <Typography>
      {entry.date} <em>{entry.description}</em>
    </Typography>
    {entry.diagnosisCodes && (
      <ul>
        {entry.diagnosisCodes.map(code => (
          <li key={code}>{code}</li>
        ))}
      </ul>
    )}
  </Box>
);

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (!id) return;
    patientService.getById(id).then(setPatient);
  }, [id]);

  if (!patient) return <div>Loading...</div>;

  return (
    <Box>
      <Typography variant="h4" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        {patient.name} <GenderIcon gender={patient.gender} />
      </Typography>
      <Typography>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>
      <Typography>date of birth: {patient.dateOfBirth}</Typography>
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>entries</Typography>
      {patient.entries.map(entry => (
        <EntryDetails key={entry.id} entry={entry} />
      ))}
    </Box>
  );
};

export default PatientPage;
