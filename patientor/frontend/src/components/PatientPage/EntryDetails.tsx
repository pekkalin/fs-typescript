import { Typography, Box } from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import WorkIcon from "@mui/icons-material/Work";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FavoriteIcon from "@mui/icons-material/Favorite";

import {
  Entry,
  Diagnosis,
  HealthCheckEntry,
  OccupationalHealthcareEntry,
  HospitalEntry,
  HealthCheckRating,
} from "../../types";

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

const healthRatingColor: Record<HealthCheckRating, string> = {
  [HealthCheckRating.Healthy]: "green",
  [HealthCheckRating.LowRisk]: "yellow",
  [HealthCheckRating.HighRisk]: "orange",
  [HealthCheckRating.CriticalRisk]: "red",
};

const DiagnosisList = ({
  codes,
  diagnosisMap,
}: {
  codes: Array<Diagnosis["code"]>;
  diagnosisMap: Record<string, string>;
}) => (
  <ul>
    {codes.map(code => (
      <li key={code}>
        {code} {diagnosisMap[code]}
      </li>
    ))}
  </ul>
);

const HealthCheckDetails = ({
  entry,
  diagnosisMap,
}: {
  entry: HealthCheckEntry;
  diagnosisMap: Record<string, string>;
}) => (
  <>
    <Typography sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      {entry.date} <MedicalServicesIcon fontSize="small" />
    </Typography>
    <Typography><em>{entry.description}</em></Typography>
    <FavoriteIcon sx={{ color: healthRatingColor[entry.healthCheckRating] }} />
    {entry.diagnosisCodes && (
      <DiagnosisList codes={entry.diagnosisCodes} diagnosisMap={diagnosisMap} />
    )}
    <Typography>diagnose by {entry.specialist}</Typography>
  </>
);

const OccupationalHealthcareDetails = ({
  entry,
  diagnosisMap,
}: {
  entry: OccupationalHealthcareEntry;
  diagnosisMap: Record<string, string>;
}) => (
  <>
    <Typography sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      {entry.date} <WorkIcon fontSize="small" /> <em>{entry.employerName}</em>
    </Typography>
    <Typography><em>{entry.description}</em></Typography>
    {entry.sickLeave && (
      <Typography>
        sick leave: {entry.sickLeave.startDate} – {entry.sickLeave.endDate}
      </Typography>
    )}
    {entry.diagnosisCodes && (
      <DiagnosisList codes={entry.diagnosisCodes} diagnosisMap={diagnosisMap} />
    )}
    <Typography>diagnose by {entry.specialist}</Typography>
  </>
);

const HospitalDetails = ({
  entry,
  diagnosisMap,
}: {
  entry: HospitalEntry;
  diagnosisMap: Record<string, string>;
}) => (
  <>
    <Typography sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      {entry.date} <LocalHospitalIcon fontSize="small" />
    </Typography>
    <Typography><em>{entry.description}</em></Typography>
    <Typography>
      discharged: {entry.discharge.date} — {entry.discharge.criteria}
    </Typography>
    {entry.diagnosisCodes && (
      <DiagnosisList codes={entry.diagnosisCodes} diagnosisMap={diagnosisMap} />
    )}
    <Typography>diagnose by {entry.specialist}</Typography>
  </>
);

const EntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: Entry;
  diagnoses: Diagnosis[];
}) => {
  const diagnosisMap = Object.fromEntries(diagnoses.map(d => [d.code, d.name]));

  const content = (() => {
    switch (entry.type) {
      case "HealthCheck":
        return <HealthCheckDetails entry={entry} diagnosisMap={diagnosisMap} />;
      case "OccupationalHealthcare":
        return <OccupationalHealthcareDetails entry={entry} diagnosisMap={diagnosisMap} />;
      case "Hospital":
        return <HospitalDetails entry={entry} diagnosisMap={diagnosisMap} />;
      default:
        return assertNever(entry);
    }
  })();

  return (
    <Box sx={{ border: "1px solid", borderRadius: 1, p: 1.5, mb: 1.5 }}>
      {content}
    </Box>
  );
};

export default EntryDetails;
