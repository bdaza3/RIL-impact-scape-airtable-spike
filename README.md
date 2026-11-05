# RIL Impact Scape Airtable spike

Vercel link: https://ril-impact-scape-airtable-spike.vercel.app/

This spike evaluates the static architecture:

`Airtable → Airtable API → build/data generation → Next.js → Vercel`

Airtable remains the source of truth. The browser never calls Airtable and never
receives the Airtable token.

## Setup

Requires Node.js and npm. From the repository root:

1. Copy `.env.example` to `.env`.
2. Set `AIRTABLE_PERSONAL_ACCESS_TOKEN` to an Airtable Personal Access Token
   with `data.records:read` access to the base. Set `AIRTABLE_BASE_ID`,
   `AIRTABLE_TABLE_ID_OR_NAME`, and `AIRTABLE_VIEW_ID_OR_NAME` to the base,
   table, and view to fetch. The table and view values may be names or IDs.
3. From the Next.js project directory, run:

   ```sh
   cd impact-scape-spike
   npm run fetch:airtable
   ```

Run the development server with `npm run dev`. Run `npm run build` for a
production build; it fetches fresh Airtable data before generating the static
site. This means Vercel must have the four Airtable variables configured as
build environment variables.

## Airtable API and data validation

The script follows Airtable's pagination offset until all pages are fetched,
preserves each record's ID and all fields returned by Airtable, and writes the
array to `data/organizations.json` at the repository root. It also downloads
logo attachments to `impact-scape-spike/public/organization-logos` and replaces
their expiring Airtable URLs with static local paths. It prints the total number
fetched.

The latest fetch retrieved 65 Airtable records and generated 65 JSON records.
The supplied CSV snapshot contains 65 organization rows, excluding its header,
so the counts match for this spike. The generated JSON preserves the organization
name, website, SDG, audience, country, investment, and logo fields.

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

`next.config.ts` enables Next.js static export. The build output is
`impact-scape-spike/out`. For Vercel, configure the project with
`impact-scape-spike` as its root directory, set the four Airtable variables in
the project environment, and use the default `npm run build` command.

## Rebuild/update findings

The fetch-and-build process was tested successfully: running `npm run build`
retrieves the current Airtable view before producing the static site. An
Airtable record change can therefore appear after another build or redeploy.
This spike did not implement or test an automatic Airtable-to-Vercel trigger.
The current setup has no verified free direct trigger, so production would need
an approved Airtable automation, webhook, scheduled rebuild, or equivalent
integration. GitHub Actions polling, hash detection, webhooks, and other
automation are intentionally out of scope here.

Known limitations: this prototype uses the latest committed/generated JSON and
does not refresh itself when Airtable changes. Regenerate the JSON when Airtable
changes so the local logo assets stay current. The page currently has no search
box.
