# Issue Tracking Dashboard

A modern issue tracking dashboard built with Next.js (Client-Side Rendering), Ant Design, and Tailwind CSS.

## Features

- 📊 **Dashboard Overview**: View statistics about total issues, open, in-progress, and resolved issues
- 🔍 **Advanced Filtering**: Filter issues by status, project, and search by title/ID/description
- 🎯 **Issue Management**: Complete issue tracking with detailed information display
- 🎨 **Beautiful UI**: Modern, responsive design using Ant Design and Tailwind CSS
- 📱 **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- 🏗️ **Reusable Components**: Well-structured, reusable components (Card, Table, Tag, Badge)
- 🖤 **Drawer Details**: View complete issue details in a side drawer

## Tech Stack

- **Next.js 14** - React framework for production
- **TypeScript** - Type safety
- **Ant Design 5** - Enterprise UI components
- **Tailwind CSS 3** - Utility-first CSS framework
- **React 18** - UI library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

Build for production:

```bash
npm run build
npm start
```

### Docker

Build the Docker image:

```bash
docker build -t issue-tracking-dashboard:latest .
```

Run the Docker container:

```bash
docker run -d --name issue-frontend -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_API_BASE_URL=http://host.docker.internal:8080/api \
  -e NEXT_TELEMETRY_DISABLED=1 \
  issue-tracking-dashboard:latest
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page (CSR)
│   └── globals.css         # Global styles
├── components/
│   ├── common/
│   │   ├── Card.tsx        # Reusable Card component
│   │   ├── Badge.tsx       # Status badge component
│   │   ├── Tag.tsx         # Tag component
│   │   ├── IssueTable.tsx  # Reusable table component
│   │   └── index.ts        # Exports
│   ├── FilterBar.tsx       # Filter and search component
│   ├── IssueDetailDrawer.tsx  # Issue detail drawer
│   └── pages/
│       └── DashboardPage.tsx  # Main dashboard page
├── data/
│   └── mockIssues.ts       # Mock issue data
└── types/
    └── issue.ts            # TypeScript types
```

## Features in Detail

### 1. Dashboard Statistics
- Total issues count
- Open issues count
- In-progress issues count
- Resolved/Closed issues count

### 2. Filter Bar
- **Project Filter**: Filter by project (Frontend, Backend, DevOps, etc.)
- **Status Filter**: Filter by status (Open, In Progress, Closed, Resolved)
- **Search**: Full-text search across issue titles, IDs, and descriptions
- **Reset**: Clear all filters

### 3. Issues Table
- Issue ID (sortable)
- Title with truncation
- Project badge
- Status badge with color coding
- Priority level
- Assignee information
- Last updated date

### 4. Status Badges
- **Open**: Red (#d4380d)
- **In Progress**: Orange (#faad14)
- **Closed**: Blue (#1677ff)
- **Resolved**: Green (#52c41a)

### 5. Priority Levels
- **Low**: Blue
- **Medium**: Orange
- **High**: Red-Orange
- **Critical**: Dark Red

### 6. Issue Details Drawer
Click on any issue to open the detail drawer showing:
- Issue ID and title
- Status and priority badges
- Full description
- Project and assignee information
- Created and updated dates
- Action buttons

## Customization

### Adding Mock Data

Edit `src/data/mockIssues.ts` to add more issues:

```typescript
export const MOCK_ISSUES: Issue[] = [
  {
    id: 'ISS-001',
    title: 'Your issue title',
    description: 'Issue description',
    status: 'open',
    project: 'Your Project',
    priority: 'high',
    assignee: 'Assignee Name',
    createdAt: '2024-11-10',
    updatedAt: '2024-11-10',
  },
  // ... more issues
];
```

### Styling

- **Tailwind CSS**: Utility classes for styling
- **Ant Design Theme**: Customize in `tailwind.config.ts`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
