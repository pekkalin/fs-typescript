import { useState } from "react";
import axios from "axios";
import {
  Box, TextField, Button, Typography, Alert,
  Select, MenuItem, InputLabel, FormControl, Chip, OutlinedInput,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

import type { Diagnosis, Entry, HealthCheckRating } from "../../types";
import { HealthCheckRating as HealthCheckRatingEnum } from "../../types";
import patientService from "../../services/patients";

type EntryType = "HealthCheck" | "OccupationalHealthcare" | "Hospital";

interface Props {
  patientId: string;
  diagnoses: Diagnosis[];
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

const ratingLabels: Record<HealthCheckRating, string> = {
  [HealthCheckRatingEnum.Healthy]: "Healthy",
  [HealthCheckRatingEnum.LowRisk]: "Low Risk",
  [HealthCheckRatingEnum.HighRisk]: "High Risk",
  [HealthCheckRatingEnum.CriticalRisk]: "Critical Risk",
};

const AddEntryForm = ({ patientId, diagnoses, onEntryAdded, onCancel }: Props) => {
  const [type, setType] = useState<EntryType>("HealthCheck");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  // HealthCheck
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRatingEnum.Healthy);

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

  const handleCodesChange = (e: SelectChangeEvent<string[]>) => {
    const val = e.target.value;
    setSelectedCodes(typeof val === "string" ? val.split(",") : val);
  };

  const buildEntry = () => {
    const codes = selectedCodes.length > 0 ? selectedCodes : undefined;
    const base = { date, description, specialist, ...(codes && { diagnosisCodes: codes }) };

    switch (type) {
      case "HealthCheck":
        return {
          ...base,
          type: "HealthCheck" as const,
          healthCheckRating,
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

      <TextField
        fullWidth label="Date *" type="date" value={date} margin="dense"
        slotProps={{ inputLabel: { shrink: true } }}
        onChange={e => setDate(e.target.value)}
      />
      <TextField
        fullWidth label="Description *" value={description} margin="dense"
        onChange={e => setDescription(e.target.value)}
      />
      <FormControl fullWidth margin="dense">
        <InputLabel>Diagnosis codes</InputLabel>
        <Select
          multiple
          value={selectedCodes}
          onChange={handleCodesChange}
          input={<OutlinedInput label="Diagnosis codes" />}
          renderValue={selected => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map(code => <Chip key={code} label={code} size="small" />)}
            </Box>
          )}
        >
          {diagnoses.map(d => (
            <MenuItem key={d.code} value={d.code}>
              {d.code} — {d.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth label="Specialist *" value={specialist} margin="dense"
        onChange={e => setSpecialist(e.target.value)}
      />

      {type === "HealthCheck" && (
        <FormControl fullWidth margin="dense">
          <InputLabel>Health Check Rating</InputLabel>
          <Select
            value={String(healthCheckRating)}
            label="Health Check Rating"
            onChange={e => setHealthCheckRating(Number(e.target.value) as HealthCheckRating)}
          >
            {(Object.entries(ratingLabels) as [string, string][]).map(([val, label]) => (
              <MenuItem key={val} value={val}>{val} — {label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {type === "OccupationalHealthcare" && (
        <>
          <TextField fullWidth label="Employer Name *" value={employerName} margin="dense"
            onChange={e => setEmployerName(e.target.value)} />
          <TextField fullWidth label="Sick Leave Start" type="date" value={sickLeaveStart} margin="dense"
            slotProps={{ inputLabel: { shrink: true } }}
            onChange={e => setSickLeaveStart(e.target.value)} />
          <TextField fullWidth label="Sick Leave End" type="date" value={sickLeaveEnd} margin="dense"
            slotProps={{ inputLabel: { shrink: true } }}
            onChange={e => setSickLeaveEnd(e.target.value)} />
        </>
      )}

      {type === "Hospital" && (
        <>
          <TextField fullWidth label="Discharge Date *" type="date" value={dischargeDate} margin="dense"
            slotProps={{ inputLabel: { shrink: true } }}
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
