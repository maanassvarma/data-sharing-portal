# Data Sharing Portal (React + QuickSight + S3 + GraphQL)

Role-aware (Admin / Collaborator) portal that embeds **AWS QuickSight** dashboards, handles **S3 presigned** uploads & share links, and uses **Apollo GraphQL** to simulate a Postgres-backed API. Designed so mocks can be **drop-in replaced** with real endpoints.

> Independent demo for a “data-sharing portal” role. Not affiliated with any organization. Mocks are used for local development.

---

## ✨ Highlights 

- **QuickSight dashboards**  
  Uses the official embedding SDK when given a real embed URL; falls back to an iframe for local mocks. Refresh & parameter hooks included.

- **S3 data storage**  
  Upload CSVs via **presigned PUT** with progress, then surface a mock **presigned GET** link for collaborators to download/share.

- **GraphQL (PostgreSQL backend via API)**  
  Apollo Client with typed operations, optimistic mutations, and cache updates. Ready to point at a real GraphQL endpoint.

- **Look & feel parity**  
  Tailwind + shadcn/radix primitives with centralized theme tokens (CSS variables) so styles can match an existing admin platform.

- **Role-aware UI**  
  Admin can upload & manage; Collaborator can browse datasets, request access, and copy share links.

---

## 🧭 Demo Flow

1) **Dashboard** → loads QuickSight (SDK if real, iframe if mock) and shows a KPI (“Total uploaded files”).  
2) **Upload Data (Admin)** → CSV upload (≤10MB) → progress → success → creates a **Dataset** (and legacy “Thing”) via GraphQL and bumps the KPI.  
3) **Datasets (Collab/Admin)** → lists datasets, “Get Link” produces a presigned-GET style URL, “Request Access” triggers a GraphQL mutation.  
4) **Admin Data** → shows “Things” list; new uploads appear immediately (optimistic + cache write).

---

## 🧰 Tech Stack

- **React 18 + TypeScript**, **Vite**
- **Tailwind CSS**, **shadcn/radix** components
- **Apollo Client** (GraphQL) + **GraphQL Codegen**
- **MSW** (Mock Service Worker) for REST & GraphQL mocks
- **Zod** for validation, **lucide-react** icons
- **Vitest + RTL** tests

---

## 🗂️ Project Structure

```

src/
├── components/
│   ├── QuickSightEmbed.tsx
│   ├── DashboardTab.tsx
│   ├── UploadTab.tsx
│   ├── AdminTab.tsx
│   └── DatasetsTab.tsx
├── components/ui/           # shadcn/radix primitives
├── graphql/
│   ├── client.ts            # Apollo client (HttpLink, cache, persistence)
│   ├── operations.ts        # gql queries/mutations (Things, Datasets, Access)
│   └── **generated**/types.ts (via `npm run gen`)
├── hooks/
│   └── useRole.ts           # Admin/Collaborator role switch
├── lib/
│   ├── api.ts               # REST helpers (presign, upload)
│   ├── utils.ts
│   └── validations.ts       # zod schemas + QuickSight response parser
├── mocks/
│   ├── browser.ts           # MSW worker + `startMSW()`
│   └── handlers.ts          # /quicksight, /s3/presign, /s3/presign-get, GraphQL
├── types/
│   └── amazon-quicksight-embedding-sdk.d.ts  # minimal TS shim
└── index.css, main.tsx, App.tsx

````

Add’l root files:
- `schema.mock.graphql` – tiny schema for codegen  
- `codegen.yml` – GraphQL Codegen config  
- `server/presign.example.ts` – Node/AWS SDK v3 **example** for real presign (not required to run demo)

---

## 🚀 Getting Started

### Prerequisites
- **Node**: Vite requires **Node ≥ 20.19 or ≥ 22.12** (recommend 22 LTS)  
  ```bash
  nvm install 22 && nvm use 22

### Install & Initialize

```bash
npm i
npx msw init public --save   # ensures public/mockServiceWorker.js exists
npm run gen                  # GraphQL codegen from schema.mock.graphql
```

### Run (choose a stable port)

```bash
npm run dev -- --host --port 3005
# open http://localhost:3005
```

> If you see a JSON parse error on the dashboard, hard-reload with DevTools “Disable cache” and ensure the **Service Worker is activated** (DevTools → Application → Service Workers).

### Build & Preview

```bash
npm run build
npm run preview
```

---

## 🔌 API Surfaces (mocked in dev)

### REST

* `GET /quicksight/embed-url` → `{ url | embedUrl }` (QuickSight embed URL)
* `POST /s3/presign` → `{ uploadUrl, fileKey, expiresAt }` (PUT)
* `POST /s3/presign-get` → `{ downloadUrl }` (GET/share)

### GraphQL (Apollo)

* Queries:

  * `ListDatasets` → `datasets { id name owner visibility created_at }`
  * `ListThings` → `things { id name status created_at }`
* Mutations:

  * `CreateDataset(name)` → `Dataset`
  * `RequestAccess(datasetId)` → `AccessRequest`
  * `CreateThing(name)` → `Thing`

Apollo updates cache optimistically on create, so lists update instantly.

---

## 🧪 Testing

* Component tests in Vitest + React Testing Library
* Covers loading/empty/error states, basic a11y flows

```bash
npm test
npm run test:ui
npm run test:coverage
```

---

## 🎨 Theming & Look/Feel Parity

* Central **CSS variables** in `src/index.css` (neutral palette, primary, radii, spacing)
* Tailwind maps those tokens in `tailwind.config.js`
* UI primitives in `src/components/ui/*` for easy reskin to match an existing admin platform

---

## 🏭 Production Wiring (drop-in replacements)

1. **QuickSight**

   * Backend route returns `{ embedUrl: "https://...quicksight....amazonaws.com/.../embed/..." }`
   * Frontend auto-uses the SDK for real URLs, with `load`/`error` events and (optional) parameter calls

2. **S3 Presign**

   * Replace MSW with your backend for `POST /s3/presign` (PUT) and `POST /s3/presign-get` (GET).
   * See `server/presign.example.ts` (Express + AWS SDK v3) for a reference implementation.

3. **GraphQL (Postgres)**

   * Set `VITE_GRAPHQL_URL` and point Apollo HttpLink at your GraphQL endpoint; add auth headers.
   * Keep optimistic updates and cache writes for snappy UX.

4. **Auth & Roles**

   * Replace local `useRole` with real session/claims and gate features accordingly.

---

## 🔐 Environment (example)

Create `.env` (optional for prod hookup):

```
VITE_GRAPHQL_URL=https://api.example.com/graphql
VITE_APP_NAME="Data Sharing Portal"
```

---

## 📸 Screenshots

Add images/GIFs under `docs/` and reference them here:

* Dashboard (QuickSight + KPI)
* Upload flow (progress & toast)
* Datasets (Get Link / Request Access)
* Admin Data (new item appears)

---

## 📝 Roadmap (nice-to-have)

* Real auth + role claims (Cognito/Okta)
* Dataset search/filter, pagination
* Audit trail (who uploaded, who accessed)
* Parameterized QuickSight dashboards per dataset/owner
* E2E tests (Playwright) for upload/access flows

---

## 📄 License

MIT © Maanas Varma

```

