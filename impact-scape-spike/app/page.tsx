import records from "../../data/organizations.json";
import OrganizationDirectory from "./organization-directory";
import type { OrganizationRecord } from "./organizations";

export default function Home() {
  const organizations = Array.isArray(records) ? (records as OrganizationRecord[]) : [];
  return <OrganizationDirectory organizations={organizations} />;
}
