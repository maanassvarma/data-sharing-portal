# Modern Admin Dashboard

A comprehensive React admin dashboard built with Vite, TypeScript, Tailwind CSS, and shadcn/ui. Features three main tabs with different functionalities and comprehensive testing.

## Features

### 🎯 Dashboard Tab
- QuickSight iframe integration
- Fetches embed URL from `/quicksight/embed-url` endpoint
- Loading, error, and success states
- Refresh functionality

### 📁 Upload Data Tab
- File picker with drag-and-drop support
- S3 presigned URL integration via `/s3/presign` endpoint
- Mock file upload with progress tracking
- File validation and error handling

### ⚙️ Admin Data Tab
- Apollo Client with mocked GraphQL schema
- ListThings query with id, name, status, created_at fields
- CreateThing mutation for adding new items
- Real-time data updates

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Apollo Client (GraphQL)
- **API Mocking**: MSW (Mock Service Worker)
- **Validation**: Zod
- **Testing**: Vitest + React Testing Library
- **UI Components**: Radix UI primitives

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd modern-admin-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── DashboardTab.tsx    # QuickSight dashboard
│   ├── UploadTab.tsx       # File upload functionality
│   ├── AdminTab.tsx        # GraphQL admin interface
│   └── __tests__/          # Component tests
├── graphql/
│   ├── client.ts           # Apollo Client setup
│   ├── schema.ts           # Mocked GraphQL schema
│   └── queries.ts          # GraphQL queries/mutations
├── hooks/
│   └── use-toast.ts        # Toast notification hook
├── lib/
│   ├── api.ts              # REST API functions
│   ├── utils.ts            # Utility functions
│   └── validations.ts      # Zod validation schemas
├── mocks/
│   ├── browser.ts          # MSW browser setup
│   ├── server.ts           # MSW server setup
│   └── handlers.ts         # API mock handlers
└── test/
    └── setup.ts            # Test configuration
```

## API Endpoints

### REST Endpoints (Mocked with MSW)

- `GET /quicksight/embed-url` - Returns QuickSight embed URL
- `POST /s3/presign` - Returns S3 presigned URL for file upload

### GraphQL Schema (Mocked)

```graphql
type Thing {
  id: ID!
  name: String!
  status: ThingStatus!
  created_at: String!
}

enum ThingStatus {
  ACTIVE
  INACTIVE
  PENDING
}

type Query {
  listThings: [Thing!]!
}

type Mutation {
  createThing(name: String!): Thing!
}
```

## Testing

The project includes comprehensive tests for each tab component:

- **DashboardTab**: Tests iframe loading, error handling, and refresh functionality
- **UploadTab**: Tests file selection, upload process, and error states
- **AdminTab**: Tests GraphQL operations, form validation, and data display

Run tests with:
```bash
npm test
```

## Code Quality

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Configured with TypeScript and React rules
- **Accessibility**: ARIA attributes and semantic HTML throughout
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Loading indicators for all async operations

## Key Features

### Production-Ready Code
- Strict TypeScript configuration
- Comprehensive error handling
- Loading and empty states
- Accessibility compliance
- Form validation with Zod
- Toast notifications for user feedback

### Modern UI/UX
- Clean, modern design with shadcn/ui
- Responsive layout
- Smooth animations and transitions
- Intuitive navigation with tabs
- Consistent design system

### Testing Strategy
- Unit tests for all components
- Mocked API calls
- Accessibility testing
- Error state testing
- User interaction testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License. 