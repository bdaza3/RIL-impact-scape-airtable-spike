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
array to `data/organizations.json` at the repository root. It prints the total
number fetched. 
