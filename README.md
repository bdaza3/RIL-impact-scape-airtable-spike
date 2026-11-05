# RIL Impact Scape Airtable spike

This spike fetches organization records from an Airtable view and saves them as
JSON for a future static Next.js site. Airtable remains the source of truth.

## Fetch Airtable records

1. Copy `.env.example` to `.env` in the repository root.
2. Set `AIRTABLE_PERSONAL_ACCESS_TOKEN` to an Airtable Personal Access Token
   with `data.records:read` access to the base. Set `AIRTABLE_BASE_ID`,
   `AIRTABLE_TABLE_ID_OR_NAME`, and `AIRTABLE_VIEW_ID_OR_NAME` to the base,
   table, and view to fetch. The table and view values may be names or IDs.
3. From the Next.js project directory, run:

   ```sh
   cd impact-scape-spike
   npm run fetch:airtable
   ```

The script follows Airtable's pagination offset until all pages are fetched,
preserves each record's ID and all fields returned by Airtable, and writes the
array to `data/organizations.json` at the repository root. It also downloads
logo attachments to `impact-scape-spike/public/organization-logos` and replaces
their expiring Airtable URLs with static local paths. It prints the total number
fetched.

## Prototype directory

The Next.js home page imports `data/organizations.json` at build time and renders
the organization directory. The filter controls and language toggle run in the
browser; they do not call Airtable or require a server/database. Run the fetch
script before building to include the latest Airtable data.

Filters are generated from the populated Airtable values for primary SDG
(`¿Cuál es el principal ODS al que le aporta tu organización?`), investment type
(`¿Qué tipo de inversiones?`), operating country
(`País dónde tiene operaciones tu organización`), and service audience
(`¿A quiénes están dirigidos sus servicios?`). A record with multiple values
matches a selected value if any item in that field matches. Empty fields are
omitted from cards and do not prevent the page from rendering.

The English/Spanish toggle translates the page labels and organization-provided
categories, countries, audiences, investment types, and SDG values. Organization
names and website URLs remain as entered in Airtable.

`next.config.ts` enables Next.js static export. Run `npm run build` in
`impact-scape-spike` to generate the static site in `impact-scape-spike/out`.
For Vercel, configure the Next.js project with `impact-scape-spike` as its root
directory. Either commit the generated public JSON and use build command
`npm run build`, or set the four Airtable variables in Vercel and use
`npm run fetch:airtable && npm run build` so the records are fetched during the
build. The build output is `out`.

Known limitations: this prototype uses the latest committed/generated JSON and
does not refresh itself when Airtable changes. Regenerate the JSON when Airtable
changes so the local logo assets stay current. The page currently has no search
box.
