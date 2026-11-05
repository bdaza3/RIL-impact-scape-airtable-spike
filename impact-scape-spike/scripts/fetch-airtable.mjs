import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryDirectory = path.resolve(projectDirectory, "..");

// Load the repository-root .env without adding a runtime dependency. Shell
// environment variables take precedence over values in the file.
try {
  const envContents = await readFile(path.join(repositoryDirectory, ".env"), "utf8");
  for (const line of envContents.split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    const value = match[2].replace(/\s+#.*$/, "").replace(/^(["'])(.*)\1$/, "$2");
    process.env[match[1]] = value;
  }
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const requiredVariables = [
  "AIRTABLE_PERSONAL_ACCESS_TOKEN",
  "AIRTABLE_BASE_ID",
  "AIRTABLE_TABLE_ID_OR_NAME",
  "AIRTABLE_VIEW_ID_OR_NAME",
];
const missingVariables = requiredVariables.filter((name) => !process.env[name]);
if (missingVariables.length) {
  console.error(`Missing required environment variable(s): ${missingVariables.join(", ")}.`);
  console.error("Copy .env.example to .env in the repository root and fill in the Airtable values.");
  process.exit(1);
}

const { AIRTABLE_PERSONAL_ACCESS_TOKEN: token, AIRTABLE_BASE_ID: baseId } = process.env;
const table = process.env.AIRTABLE_TABLE_ID_OR_NAME;
const view = process.env.AIRTABLE_VIEW_ID_OR_NAME;
const records = [];
let offset;

function extensionForContentType(contentType) {
  return {
    "image/gif": ".gif",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/svg+xml": ".svg",
    "image/webp": ".webp",
  }[contentType?.split(";")[0].trim()];
}

async function downloadLogos(records) {
  const logosDirectory = path.join(projectDirectory, "public", "organization-logos");
  await mkdir(logosDirectory, { recursive: true });

  for (const record of records) {
    const attachments = record.fields?.["Logo de tu organización"];
    if (!Array.isArray(attachments)) continue;

    for (const attachment of attachments) {
      if (!attachment || typeof attachment !== "object" || typeof attachment.url !== "string") continue;

      const response = await fetch(attachment.url);
      if (!response.ok) {
        throw new Error(
          `Could not download logo ${attachment.filename ?? attachment.id ?? "attachment"} for ${record.id}: HTTP ${response.status}`,
        );
      }

      const extension =
        extensionForContentType(response.headers.get("content-type")) ||
        path.extname(attachment.filename ?? "").toLowerCase() ||
        ".img";
      const filename = `${record.id}-${attachment.id ?? "logo"}${extension}`;
      await writeFile(path.join(logosDirectory, filename), Buffer.from(await response.arrayBuffer()));
      attachment.url = `/organization-logos/${filename}`;
    }
  }
}

try {
  do {
    const url = new URL(
      `https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(table)}`,
    );
    url.searchParams.set("view", view);
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Airtable API returned HTTP ${response.status}: ${details}`);
    }

    const page = await response.json();
    records.push(...page.records);
    offset = page.offset;
  } while (offset);

  await downloadLogos(records);
  const outputPath = path.join(repositoryDirectory, "data", "organizations.json");
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(records, null, 2)}\n`, "utf8");
  console.log(`Fetched ${records.length} records from Airtable.`);
  console.log(`Saved records to ${path.relative(repositoryDirectory, outputPath)}.`);
} catch (error) {
  console.error(`Failed to fetch Airtable records: ${error.message}`);
  process.exit(1);
}
