import { useState } from "react";
import axios from "axios";
import {
  Box, TextField, Button, Typography, Alert,
  Select, MenuItem, InputLabel, FormControl,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

import type { Entry, HealthCheckRating } from "../../types";
import patientService from "../../services/patients";

type EntryType = "HealthCheck" | "OccupationalHealthcare" | "Hospital";

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
  const [type, setType] = useState<EntryType>("HealthCheck");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState("");

  // HealthCheck
  const [healthCheckRating, setHealthCheckRating] = useState("");

  // OccupationalHealthcare
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  // Hospital
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  const [error, setError] = useState<string | null>(null);

  const handleTypeChange = (e: SelectChangeEvent) => {
    setType(e.target.value as EntryType);
    setError(null);
  };

  const buildEntry = () => {
    const codes = diagnosisCodes.trim()
      ? diagnosisCodes.split(",").map(c => c.trim())
      : undefined;
    const base = { date, description, specialist, ...(codes && { diagnosisCodes: codes }) };

    switch (type) {
      case "HealthCheck":
        return {
          ...base,
          type: "HealthCheck" as const,
          healthCheckRating: Number(healthCheckRating) as HealthCheckRating,
        };
      case "OccupationalHealthcare": {
        const sickLeave =
          sickLeaveStart && sickLeaveEnd
            ? { startDate: sickLeaveStart, endDate: sickLeaveEnd }
            : undefined;
        return {
          ...base,
          type: "OccupationalHealthcare" as const,
          employerName,
          ...(sickLeave && { sickLeave }),
        };
      }
      case "Hospital":
        return {
          ...base,
          type: "Hospital" as const,
          discharge: { date: dischargeDate, criteria: dischargeCriteria },
        };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const entry = await patientService.addEntry(patientId, buildEntry());
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
      <Typography variant="h6" sx={{ mb: 1 }}>New Entry</Typography>
      {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}

      <FormControl fullWidth margin="dense">
        <InputLabel>Entry type</InputLabel>
        <Select value={type} label="Entry type" onChange={handleTypeChange}>
          <MenuItem value="HealthCheck">Health Check</MenuItem>
          <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
        </Select>
      </FormControl>

      <TextField fullWidth label="Date *" value={date} margin="dense"
        onChange={e => setDate(e.target.value)} />
      <TextField fullWidth label="Description *" value={description} margin="dense"
        onChange={e => setDescription(e.target.value)} />
      <TextField fullWidth label="Specialist *" value={specialist} margin="dense"
        onChange={e => setSpecialist(e.target.value)} />
      <TextField fullWidth label="Diagnosis Codes (comma-separated)" value={diagnosisCodes} margin="dense"
        onChange={e => setDiagnosisCodes(e.target.value)} />

      {type === "HealthCheck" && (
        <TextField fullWidth label="Health Check Rating (0-3) *" value={healthCheckRating} margin="dense"
          onChange={e => setHealthCheckRating(e.target.value)} />
      )}

      {type === "OccupationalHealthcare" && (
        <>
          <TextField fullWidth label="Employer Name *" value={employerName} margin="dense"
            onChange={e => setEmployerName(e.target.value)} />
          <TextField fullWidth label="Sick Leave Start" value={sickLeaveStart} margin="dense"
            onChange={e => setSickLeaveStart(e.target.value)} />
          <TextField fullWidth label="Sick Leave End" value={sickLeaveEnd} margin="dense"
            onChange={e => setSickLeaveEnd(e.target.value)} />
        </>
      )}

      {type === "Hospital" && (
        <>
          <TextField fullWidth label="Discharge Date *" value={dischargeDate} margin="dense"
            onChange={e => setDischargeDate(e.target.value)} />
          <TextField fullWidth label="Discharge Criteria *" value={dischargeCriteria} margin="dense"
            onChange={e => setDischargeCriteria(e.target.value)} />
        </>
      )}

      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <Button type="submit" variant="contained">Add</Button>
        <Button type="button" variant="outlined" onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default AddEntryForm;
