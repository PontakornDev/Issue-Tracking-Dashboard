# Issue Tracking Dashboard - Copilot Instructions

## Project Overview

This is an Issue Tracking Dashboard built with Next.js (Client-Side Rendering), Ant Design, and Tailwind CSS. It provides a comprehensive UI for managing and tracking issues with filtering, search, and detailed views.

## Technology Stack

- **Framework**: Next.js 14 with CSR
- **UI Library**: React 18
- **Component Library**: Ant Design 5
- **Styling**: Tailwind CSS 3
- **Language**: TypeScript

## Project Structure

```
src/
├── app/                           # Next.js app directory
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Home page (CSR entry point)
│   └── globals.css               # Global styles
├── components/
│   ├── common/                   # Reusable components
│   │   ├── Card.tsx              # Reusable Card wrapper
│   │   ├── Badge.tsx             # Status badge display
│   │   ├── Tag.tsx               # Flexible tag component
│   │   ├── IssueTable.tsx        # Ant Design table wrapper
│   │   └── index.ts              # Component exports
│   ├── FilterBar.tsx             # Search and filter controls
│   ├── IssueDetailDrawer.tsx     # Issue details drawer component
│   └── pages/
│       └── DashboardPage.tsx     # Main dashboard page
├── data/
│   └── mockIssues.ts             # Mock data for issues
└── types/
    └── issue.ts                  # TypeScript interfaces and types

Configuration Files:
- next.config.js                  # Next.js configuration
- tailwind.config.ts              # Tailwind CSS configuration
- tsconfig.json                   # TypeScript configuration
- postcss.config.js               # PostCSS configuration for Tailwind
- package.json                    # Dependencies and scripts
- .eslintrc.json                  # ESLint configuration
```

## Key Features Implemented

### 1. Dashboard Statistics

- Displays total issues, open, in-progress, and resolved counts
- Uses Ant Design Statistic components with icons
- Color-coded for quick visual reference

### 2. Advanced Filtering

- Filter by Project (dropdown)
- Filter by Status (Open, In Progress, Closed, Resolved)
- Full-text search across titles, IDs, and descriptions
- Reset filters button
- Real-time filtering updates

### 3. Issue Table

- Sortable columns
- Color-coded status badges
- Priority level indicators
- Assignee information
- Last updated date
- Click rows to view details

### 4. Reusable Components

- **Card**: Wrapper component with optional title and click handling
- **Badge**: Status display with customizable colors
- **Tag**: Flexible tag display with background and text colors
- **IssueTable**: Ant Design table with custom styling

### 5. Issue Details Drawer

- Side drawer showing complete issue details
- Status and priority badges
- Description, project, assignee
- Created and updated dates
- Action buttons for editing and comments

## Development Guidelines

### Adding New Issues

Edit `src/data/mockIssues.ts` and add to `MOCK_ISSUES` array:

```typescript
{
  id: 'ISS-XXX',
  title: 'Issue title',
  description: 'Detailed description',
  status: 'open' | 'in-progress' | 'closed' | 'resolved',
  project: 'Project name',
  priority: 'low' | 'medium' | 'high' | 'critical',
  assignee: 'Name',
  createdAt: 'YYYY-MM-DD',
  updatedAt: 'YYYY-MM-DD'
}
```

### Creating New Components

1. Place in `src/components/` or `src/components/common/`
2. Use TypeScript interfaces for props
3. Mark as `'use client'` for client-side components
4. Export from appropriate index files

### Styling Guidelines

- Use Tailwind CSS utilities for styling
- Follow component-based structure
- Maintain responsive design
- Use Ant Design for form controls

### Status Colors

- **Open**: #d4380d (Red)
- **In Progress**: #faad14 (Orange)
- **Closed**: #1677ff (Blue)
- **Resolved**: #52c41a (Green)

## Running the Project

### Development Server

```bash
npm run dev
```

Access at http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Common Tasks

### Adding a New Filter

1. Update `FilterBar.tsx` with new Select component
2. Add filter logic to `useMemo` hook
3. Update `onFilterChange` callback

### Customizing Colors

1. Update `ISSUE_STATUSES` in `src/types/issue.ts`
2. Update color references in components
3. Ensure WCAG contrast compliance

### Extending Issue Data

1. Add new fields to `Issue` interface in `src/types/issue.ts`
2. Update mock data in `src/data/mockIssues.ts`
3. Update table columns and drawer display

## Troubleshooting

### Port Already in Use

```bash
lsof -i :3000
kill -9 <PID>
```

### Dependencies Not Installing

```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
npm run lint
# Check tsconfig.json settings
```

## Performance Considerations

- Table uses React keys for list rendering
- Filters use useMemo to prevent unnecessary re-renders
- Ant Design components are already optimized
- Consider adding pagination for large datasets

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

- Backend API integration
- User authentication
- Real-time updates with WebSockets
- Issue creation/editing forms
- Comment system
- Activity timeline
- Export to CSV/PDF
- Dark mode support
