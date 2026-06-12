import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";

import { Patient, Gender, Diagnosis, Entry } from "../../types";
import patientService from "../../services/patients";
import EntryDetails from "./EntryDetails";
import AddEntryForm from "./AddEntryForm";

interface Props {
  diagnoses: Diagnosis[];
}

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

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    patientService.getById(id).then(setPatient);
  }, [id]);

  if (!patient) return <div>Loading...</div>;

  const handleEntryAdded = (entry: Entry) => {
    setPatient({ ...patient, entries: patient.entries.concat(entry) });
    setShowForm(false);
  };

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
        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
      {showForm
        ? <AddEntryForm
            patientId={patient.id}
            onEntryAdded={handleEntryAdded}
            onCancel={() => setShowForm(false)}
          />
        : <Button variant="contained" sx={{ mt: 2 }} onClick={() => setShowForm(true)}>
            Add New Entry
          </Button>
      }
    </Box>
  );
};

export default PatientPage;
