# Impact Scape production effort estimate

These are rough planning estimates for the actual Impact Scape application,
not a commitment or an estimate only for completing this technical spike. They
represent **total engineering effort** unless otherwise stated. The expected
team size is three engineers, but the calendar interpretation accounts for
dependencies and work that cannot be parallelized perfectly.

## Summary estimate

| Workstream | Total engineering effort | Confidence | Notes |
| --- | ---: | --- | --- |
| Discovery and technical planning | 1-2 engineering weeks | Medium | Depends on the final Airtable model, product scope, and reusable/open-source boundaries |
| Airtable integration and data pipeline | 1-2 engineering weeks | High for the basic path; medium for production hardening | The spike fetched 65 records with pagination; production adds normalization, validation, limits, and error handling |
| Organization directory, details, search, and filters | 2-4 engineering weeks | Medium | Directory is demonstrated; detail pages, search, sorting, and robust states remain |
| Ecosystem discovery and visualization | 2-5 engineering weeks | Low | Requirements and relationship data are not yet defined |
| Non-financial support and resources | 2-4 engineering weeks | Medium-low | Depends on resource entities, relationships, workflows, and content completeness |
| Spanish/English production support | 2-4 engineering weeks | Medium-low | A UI toggle is demonstrated, but bilingual content and translation management are not |
| UX/UI implementation and accessibility | 2-4 engineering weeks | Medium | Estimate excludes primary UX research and visual design; includes responsive implementation and accessible components |
| Security and production hardening | 1-2 engineering weeks | Medium | Includes credential protection, validation, headers, dependency review, and environment configuration |
| Performance and scalability | 1-3 engineering weeks | Medium-low | Depends on record volume, search needs, relationship complexity, and monitoring requirements |
| Automated data updates | 1-3 engineering weeks | Low-medium | Depends on the approved Airtable/Vercel trigger and available plan capabilities |
| Testing and QA | 2-4 engineering weeks | Medium | Includes integration, end-to-end, bilingual, responsive, accessibility, and deployment testing |
| Open-source preparation | 1-2 engineering weeks | High | Includes cleanup, configuration boundaries, setup, contribution guidance, and licensing decisions |
| Technical documentation | 1-2 engineering weeks | High | Includes architecture, data model, deployment, maintenance, troubleshooting, and adaptation guidance |
| Handoff and knowledge transfer | 1-2 engineering weeks | High | Includes onboarding, walkthroughs, deployment/data-source handoff, and technical-debt review |

The ranges total approximately **20-40 engineering weeks**. This is not a
promise that the project requires 20-40 calendar weeks: several workstreams can
overlap, while discovery, data-model decisions, visualization, bilingual
content, and the update mechanism create dependencies.

## Calendar interpretation for three engineers

With three engineers, a realistic interpretation is approximately:

- **Planning: weeks 1-4** — confirm the Airtable data model, product
  boundaries, information architecture, relationship/visualization direction,
  bilingual content strategy, security constraints, and update strategy.
- **Core development: weeks 5-12** — implement the production data pipeline,
  directory/detail experience, initial search and filters, the agreed resource
  model, responsive UI, deployment path, and the highest-priority language
  support. Testing and documentation should happen continuously.
- **Handoff and final documentation: weeks 13-16** — complete QA and
  accessibility checks, stabilize deployment/update procedures, prepare
  open-source materials, document maintenance, and transfer ownership.

The basic directory and Airtable pipeline are realistic within the eight-week
core period. A fully specified visualization, a large resource catalog, robust
bilingual content, and automated updates are the most likely features to exceed
that period if they are all required at the same time. A phased release should
prioritize the directory, data quality, search/filtering, and a clearly scoped
resource experience before advanced visualization.

## What the spike established

The prototype successfully fetched **65 Airtable records** using the Airtable
API, followed pagination, generated **65 JSON records**, and rendered a static
Next.js directory with filters and an ES/EN interface. The supplied CSV snapshot
also contains 65 organization rows, so the basic source-count comparison
matched.

This makes the basic Airtable-to-static-directory path relatively low risk.
Production effort is higher because the application still needs a deliberate
normalized data model, validation for inconsistent or missing fields, API-limit
handling, reliable error reporting, a supported update/rebuild mechanism,
maintainable bilingual content, security review, automated tests, and an
operational handoff.

## Major uncertainties

The estimate should be revisited after planning. The largest unknowns are:

- The final Airtable schema, number of tables/views, and expected record volume.
- Whether ecosystem relationships are already represented or must be modeled.
- The exact visualization and interaction requirements.
- Whether support resources need their own editorial workflow and entities.
- How much Spanish and English content already exists, and who maintains
  translations.
- Search requirements, including whether simple client-side filtering is enough
  or a search index is needed.
- The target accessibility standard and depth of content review.
- The production Airtable-to-Vercel update mechanism and Airtable plan limits.
- Whether RIL needs an Airtable editing workflow, approvals, or publishing
  states beyond the current setup.

The current spike does not verify a free automatic Airtable-to-Vercel trigger.
The production estimate therefore treats update automation as uncertain and
does not assume that a webhook, scheduled rebuild, or Airtable automation is
available without confirmation.
