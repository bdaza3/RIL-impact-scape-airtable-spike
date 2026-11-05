export type OrganizationRecord = {
  id?: string;
  fields?: Record<string, unknown>;
};

export const fields = {
  name: "Nombre de tu organización",
  primarySdg: "¿Cuál es el principal ODS al que le aporta tu organización?",
  secondarySdgs: "¿Cuál es el ODS secundario al que le aporta tu organización? (3 selecciones)",
  audience: "¿A quiénes están dirigidos sus servicios?",
  countries: "País dónde tiene operaciones tu organización",
  investmentTypes: "¿Qué tipo de inversiones?",
  website: "Website de tu organización",
  logo: "Logo de tu organización",
} as const;

export function textValues(value: unknown): string[] {
  if (typeof value === "string") return value.trim() ? [value] : [];
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

export function fieldValues(record: OrganizationRecord, field: string): string[] {
  return textValues(record.fields?.[field]);
}

export function organizationName(record: OrganizationRecord): string {
  return fieldValues(record, fields.name)[0] ?? "";
}

export function uniqueOptions(records: OrganizationRecord[], field: string): string[] {
  return [...new Set(records.flatMap((record) => fieldValues(record, field)))].sort((a, b) =>
    a.localeCompare(b, "es"),
  );
}
