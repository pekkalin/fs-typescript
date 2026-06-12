import { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";

import type { Entry, HealthCheckRating } from "../../types";
import patientService from "../../services/patients";

interface Props {
  patientId: string;
  onEntryAdded: (entry: Entry) => void;
  onCancel: () => void;
}

interface ZodIssue {
  path: (string | number)[];
  message: string;
}

const formatError = (data: unknown): string => {
  if (Array.isArray(data)) {
    return (data as ZodIssue[])
      .map(i => `${i.path[i.path.length - 1]}: ${i.message}`)
      .join(", ");
  }
  if (typeof data === "string") return data;
  return "Unknown error";
};

const AddEntryForm = ({ patientId, onEntryAdded, onCancel }: Props) => {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [healthCheckRating, setHealthCheckRating] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const codes = diagnosisCodes.trim()
      ? diagnosisCodes.split(",").map(c => c.trim())
      : undefined;

    try {
      const entry = await patientService.addEntry(patientId, {
        type: "HealthCheck",
        date,
        description,
        specialist,
        healthCheckRating: Number(healthCheckRating) as HealthCheckRating,
        ...(codes && { diagnosisCodes: codes }),
      });
      onEntryAdded(entry);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        setError(formatError(data?.error ?? data));
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ border: "2px dashed grey", borderRadius: 1, p: 2, mt: 2 }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>New HealthCheck Entry</Typography>
      {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
      <TextField
        fullWidth label="Date *" value={date} margin="dense"
        onChange={e => setDate(e.target.value)}
      />
      <TextField
        fullWidth label="Description *" value={description} margin="dense"
        onChange={e => setDescription(e.target.value)}
      />
      <TextField
        fullWidth label="Specialist *" value={specialist} margin="dense"
        onChange={e => setSpecialist(e.target.value)}
      />
      <TextField
        fullWidth label="Health Check Rating (0-3) *" value={healthCheckRating} margin="dense"
        onChange={e => setHealthCheckRating(e.target.value)}
      />
      <TextField
        fullWidth label="Diagnosis Codes (comma-separated)" value={diagnosisCodes} margin="dense"
        onChange={e => setDiagnosisCodes(e.target.value)}
      />
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <Button type="submit" variant="contained">Add</Button>
        <Button type="button" variant="outlined" onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default AddEntryForm;
