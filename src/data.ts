import { Member, Task, ActivityLog } from './types';

export const MEMBERS: Member[] = [
  {
    id: 'sarah-cooper',
    name: 'Sarah Cooper',
    role: 'Lead UX/UI Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    email: 'sarah.c@aetherengine.io'
  },
  {
    id: 'alex-rivera',
    name: 'Alex Rivera',
    role: 'Senior Full Stack Dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    email: 'alex.rivera@aetherengine.io'
  },
  {
    id: 'marcus-chen',
    name: 'Marcus Chen',
    role: 'Product Director',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    email: 'm.chen@aetherengine.io'
  },
  {
    id: 'lily-evans',
    name: 'Lily Evans',
    role: 'Database Engineer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
    email: 'l.evans@aetherengine.io'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Audit Firestore security rules & update-gaps',
    description: 'Perform a hardened security audit of Firestore rules to prevent unauthorized reads and write bypasses. Verify exact map keys size and validate identity fields.',
    status: 'review',
    priority: 'urgent',
    category: 'Security',
    dueDate: '2026-06-25',
    assigneeId: 'lily-evans',
    tags: ['Firestore', 'RBAC', 'Audit'],
    createdAt: '2026-06-20T08:30:00Z'
  },
  {
    id: 'task-2',
    title: 'Design high-fidelity neon UI design tokens',
    description: 'Establish standard styling rules, shadows, and neon teal/blue gradient profiles for the responsive web portal layout.',
    status: 'done',
    priority: 'high',
    category: 'Design',
    dueDate: '2026-06-22',
    assigneeId: 'sarah-cooper',
    tags: ['Figma', 'Colors', 'System'],
    createdAt: '2026-06-18T10:15:00Z'
  },
  {
    id: 'task-3',
    title: 'Optimize API gateway Websocket connections',
    description: 'Implement ping-pong heartbeat and local message queue compression to reduce server-side frame delivery latencies.',
    status: 'in-progress',
    priority: 'medium',
    category: 'Backend',
    dueDate: '2026-06-28',
    assigneeId: 'alex-rivera',
    tags: ['WebSockets', 'Go', 'Latency'],
    createdAt: '2026-06-21T09:00:00Z'
  },
  {
    id: 'task-4',
    title: 'Integrate workspace calendar synchronization API',
    description: 'Build Google Calendar event mirroring logic triggered by task milestone creations with secure OAuth credentials.',
    status: 'todo',
    priority: 'high',
    category: 'Integrations',
    dueDate: '2026-07-02',
    assigneeId: 'marcus-chen',
    tags: ['OAuth', 'Calendar', 'GCP'],
    createdAt: '2026-06-22T14:45:00Z'
  },
  {
    id: 'task-5',
    title: 'Write comprehensive Cypress E2E drag-drop tests',
    description: 'Verify cross-column task movement triggers appropriate snapshot state synchronizations and relative feed logging.',
    status: 'todo',
    priority: 'low',
    category: 'QA',
    dueDate: '2026-07-05',
    assigneeId: 'alex-rivera',
    tags: ['E2E', 'Cypress', 'Tests'],
    createdAt: '2026-06-23T04:20:00Z'
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    taskId: 'task-2',
    taskTitle: 'Design high-fidelity neon UI design tokens',
    userId: 'sarah-cooper',
    userName: 'Sarah Cooper',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    action: 'marked task as Done',
    timestamp: '2026-06-23T02:15:00Z'
  },
  {
    id: 'log-2',
    taskId: 'task-1',
    taskTitle: 'Audit Firestore security rules & update-gaps',
    userId: 'lily-evans',
    userName: 'Lily Evans',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
    action: 'submitted work for Review',
    timestamp: '2026-06-23T03:45:00Z'
  },
  {
    id: 'log-3',
    taskId: 'task-3',
    taskTitle: 'Optimize API gateway Websocket connections',
    userId: 'alex-rivera',
    userName: 'Alex Rivera',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    action: 'started working on task',
    timestamp: '2026-06-23T05:00:00Z'
  }
];

export const MOCK_ACTIVITY_TEMPLATES = [
  {
    userId: 'sarah-cooper',
    userName: 'Sarah Cooper',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    action: 'updated typography scale to Inter & Space Grotesk',
  },
  {
    userId: 'alex-rivera',
    userName: 'Alex Rivera',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    action: 'deployed build to staging container successfully',
  },
  {
    userId: 'marcus-chen',
    userName: 'Marcus Chen',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    action: 'approved product sprint release schedule',
  },
  {
    userId: 'lily-evans',
    userName: 'Lily Evans',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
    action: 'indexed metadata.json fields & completed schema check',
  }
];
