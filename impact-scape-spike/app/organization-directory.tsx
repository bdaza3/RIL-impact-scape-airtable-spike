"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  fieldValues,
  fields,
  organizationName,
  uniqueOptions,
  type OrganizationRecord,
} from "./organizations";

type Language = "en" | "es";
type FilterKey = "primarySdg" | "investmentTypes" | "countries" | "audience";
type DisplayKey = FilterKey | "secondarySdgs";

const copy = {
  en: {
    title: "Impact Scape",
    subtitle: "Explore organizations working toward social and environmental impact.",
    filters: {
      primarySdg: "Primary SDG",
      investmentTypes: "Investment type",
      countries: "Country of operation",
      audience: "Services are for",
    },
    all: "All",
    count: "organizations",
    website: "Visit website",
    empty: "No organizations match these filters.",
    noData: "No organization data is available yet. Fetch the Airtable records to get started.",
    unnamed: "Unnamed organization",
    secondarySdgs: "Also contributes to",
  },
  es: {
    title: "Impact Scape",
    subtitle: "Explora organizaciones que trabajan por el impacto social y ambiental.",
    filters: {
      primarySdg: "ODS principal",
      investmentTypes: "Tipo de inversión",
      countries: "País de operación",
      audience: "Servicios dirigidos a",
    },
    all: "Todos",
    count: "organizaciones",
    website: "Visitar sitio web",
    empty: "Ninguna organización coincide con estos filtros.",
    noData: "Aún no hay datos de organizaciones. Obtén los registros de Airtable para comenzar.",
    unnamed: "Organización sin nombre",
    secondarySdgs: "También contribuye a",
  },
} satisfies Record<Language, object>;

const filterFields: Record<FilterKey, string> = {
  primarySdg: fields.primarySdg,
  investmentTypes: fields.investmentTypes,
  countries: fields.countries,
  audience: fields.audience,
};

const sdgNames: Record<string, string> = {
  "1": "No Poverty",
  "2": "Zero Hunger",
  "3": "Good Health and Well-Being",
  "4": "Quality Education",
  "5": "Gender Equality",
  "6": "Clean Water and Sanitation",
  "7": "Affordable and Clean Energy",
  "8": "Decent Work and Economic Growth",
  "9": "Industry, Innovation and Infrastructure",
  "10": "Reduced Inequalities",
  "11": "Sustainable Cities and Communities",
  "12": "Responsible Consumption and Production",
  "13": "Climate Action",
  "14": "Life Below Water",
  "17": "Partnerships for the Goals",
};

const optionTranslations: Partial<Record<DisplayKey, Record<string, string>>> = {
  countries: {
    "Estados Unidos": "United States",
    "México": "Mexico",
    "Argentina": "Argentina",
    "Chile": "Chile",
    "Colombia": "Colombia",
    "Costa Rica": "Costa Rica",
    "Ecuador": "Ecuador",
    "El Salvador": "El Salvador",
    "Panamá": "Panama",
    "Paraguay": "Paraguay",
    "Perú": "Peru",
    "Uruguay": "Uruguay",
    "Venezuela": "Venezuela",
    "Nicaragua": "Nicaragua",
    "Brasil": "Brazil",
    "Bolivia": "Bolivia",
    "Guatemala": "Guatemala",
    "Honduras": "Honduras",
    "República Dominicana": "Dominican Republic",
    "Cuba": "Cuba",
  },
  investmentTypes: {
    "Capital de riesgo / emprendedor": "Venture capital / entrepreneurship",
    "Family Office - (Fondo privado de empresa o familia)": "Family office (private company or family fund)",
    "Grupos de ángeles inversionistas": "Angel investor groups",
    "Fondo de deuda / Banca": "Debt fund / banking",
    Corporativo: "Corporate",
    "Fondo de Inversión Corporativo (CVC)": "Corporate venture capital fund (CVC)",
    "Fundación (Donataria)": "Foundation (registered nonprofit)",
    "Incubadora / Aceleradora": "Incubator / accelerator",
    Otro: "Other",
    Crowfunding: "Crowdfunding",
    "Subvención / Grant": "Grant",
  },
  audience: {
    "Individuos (tu mercado son individuos)": "Individuals (individual customers)",
    "Startups & PyMEs (tu mercado son organizaciones)": "Startups & SMEs (organizations)",
    "Gobiernos y Organizaciones Intergubernamentales (IGOs)":
      "Governments and Intergovernmental Organizations (IGOs)",
    "Corporaciones - Fundaciones Privadas y Organizaciones Internacionales NO-gubernamentales (INGOs)":
      "Corporations, Private Foundations, and International Non-Governmental Organizations (INGOs)",
  },
};

function optionLabel(key: DisplayKey, value: string, language: Language): string {
  if (language === "es") return value;

  if (key === "primarySdg" || key === "secondarySdgs") {
    const match = value.match(/^ODS\s+(\d+)\s*:?[ ]*(.*)$/);
    if (match && sdgNames[match[1]]) return `SDG ${match[1]}: ${sdgNames[match[1]]}`;
  }

  return optionTranslations[key]?.[value] ?? value;
}

function displayValues(key: DisplayKey, values: string[], language: Language): string[] {
  return values.map((value) => optionLabel(key, value, language));
}

export default function OrganizationDirectory({
  organizations,
}: {
  organizations: OrganizationRecord[];
}) {
  const [language, setLanguage] = useState<Language>("es");
  const [filters, setFilters] = useState<Record<FilterKey, string>>({
    primarySdg: "",
    investmentTypes: "",
    countries: "",
    audience: "",
  });
  const labels = copy[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const options = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(filterFields).map(([key, field]) => [key, uniqueOptions(organizations, field)]),
      ) as Record<FilterKey, string[]>,
    [organizations],
  );

  const visibleOrganizations = organizations.filter((organization) =>
    (Object.keys(filterFields) as FilterKey[]).every((key) => {
      const selected = filters[key];
      return !selected || fieldValues(organization, filterFields[key]).includes(selected);
    }),
  );

  function updateFilter(key: FilterKey, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <main className="directory">
      <header className="page-header">
        <div>
          <h1>{labels.title}</h1>
          <p>{labels.subtitle}</p>
        </div>
        <div className="language-toggle" aria-label="Language / Idioma">
          <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>
            English
          </button>
          <span aria-hidden="true">|</span>
          <button type="button" aria-pressed={language === "es"} onClick={() => setLanguage("es")}>
            Español
          </button>
        </div>
      </header>

      <section className="filters" aria-label={language === "es" ? "Filtros" : "Filters"}>
        {(Object.keys(filterFields) as FilterKey[]).map((key) => (
          <label className="filter-control" key={key}>
            <span>{labels.filters[key]}</span>
            <select value={filters[key]} onChange={(event) => updateFilter(key, event.target.value)}>
              <option value="">{labels.all}</option>
              {options[key].map((option) => (
                <option value={option} key={option}>
                  {optionLabel(key, option, language)}
                </option>
              ))}
            </select>
          </label>
        ))}
      </section>

      <p className="result-count" aria-live="polite">
        {visibleOrganizations.length} {labels.count}
      </p>

      {organizations.length === 0 ? (
        <p className="empty-state">{labels.noData}</p>
      ) : visibleOrganizations.length === 0 ? (
        <p className="empty-state">{labels.empty}</p>
      ) : (
        <section className="organization-list" aria-label={labels.title}>
          {visibleOrganizations.map((organization, index) => {
            const name = organizationName(organization) || labels.unnamed;
            const website = fieldValues(organization, fields.website)[0];
            const primarySdg = displayValues(
              "primarySdg",
              fieldValues(organization, fields.primarySdg),
              language,
            );
            const secondarySdgs = displayValues(
              "secondarySdgs",
              fieldValues(organization, fields.secondarySdgs),
              language,
            );
            const investmentTypes = displayValues(
              "investmentTypes",
              fieldValues(organization, fields.investmentTypes),
              language,
            );
            const countries = displayValues("countries", fieldValues(organization, fields.countries), language);
            const audience = displayValues("audience", fieldValues(organization, fields.audience), language);
            const logoValue = organization.fields?.[fields.logo];
            const logo = Array.isArray(logoValue) && logoValue.length > 0 ? logoValue[0] : undefined;
            const logoUrl =
              logo && typeof logo === "object"
                ? ((logo as { url?: string }).url ??
                  ((logo as { thumbnails?: { large?: { url?: string } } }).thumbnails?.large?.url))
                : undefined;

            return (
              <article className="organization-card" key={organization.id ?? `${name}-${index}`}>
                {logoUrl ? (
                  <Image
                    className="organization-logo"
                    src={logoUrl}
                    alt=""
                    width={84}
                    height={84}
                    unoptimized
                  />
                ) : null}
                <div className="organization-content">
                  <h2>{name}</h2>
                  {primarySdg.length > 0 ? <p className="primary-sdg">{primarySdg.join(", ")}</p> : null}
                  <dl className="organization-details">
                    {investmentTypes.length > 0 ? (
                      <Detail label={labels.filters.investmentTypes} values={investmentTypes} />
                    ) : null}
                    {countries.length > 0 ? (
                      <Detail label={labels.filters.countries} values={countries} />
                    ) : null}
                    {audience.length > 0 ? (
                      <Detail label={labels.filters.audience} values={audience} />
                    ) : null}
                    {secondarySdgs.length > 0 ? (
                      <Detail label={labels.secondarySdgs} values={secondarySdgs} />
                    ) : null}
                  </dl>
                  {website ? (
                    <a href={website} target="_blank" rel="noreferrer">
                      {labels.website} ↗
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

function Detail({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{values.join(", ")}</dd>
    </div>
  );
}
