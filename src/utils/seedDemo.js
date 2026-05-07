/**
 * seedDemoData — called once after demo login to populate realistic projects/tasks.
 * Run from browser console: import('/src/utils/seedDemo.js').then(m => m.seedDemoData('demo-uid'))
 */

import { projectsApi, tasksApi } from '../services/api.js';
import { STATUS, PRIORITY } from './constants.js';

export async function seedDemoData(userId) {
  const existing = await projectsApi.getAll(userId);
  if (existing.length > 0) return; // already seeded

  const now = new Date();
  const d = (offsetDays) => {
    const dt = new Date(now);
    dt.setDate(dt.getDate() + offsetDays);
    return dt.toISOString().split('T')[0];
  };

  // Create projects
  const p1 = await projectsApi.create(userId, {
    name: 'Product Redesign',
    description: 'Redesigning the core product UI for Q3 launch.',
    color: '#6366f1',
  });
  const p2 = await projectsApi.create(userId, {
    name: 'API Integration',
    description: 'Connect frontend to new REST API endpoints.',
    color: '#22c55e',
  });
  const p3 = await projectsApi.create(userId, {
    name: 'Marketing Site',
    description: 'Landing page, blog, and SEO improvements.',
    color: '#f97316',
  });

  // Seed tasks for p1
  const p1Tasks = [
    { title: 'Define design system tokens', status: STATUS.DONE, priority: PRIORITY.HIGH, dueDate: d(-5) },
    { title: 'Create component library', status: STATUS.IN_PROGRESS, priority: PRIORITY.HIGH, dueDate: d(2) },
    { title: 'Design dashboard mockups', status: STATUS.IN_REVIEW, priority: PRIORITY.MEDIUM, dueDate: d(4) },
    { title: 'Implement dark mode', status: STATUS.DONE, priority: PRIORITY.MEDIUM, dueDate: d(-2) },
    { title: 'Responsive mobile layout', status: STATUS.TODO, priority: PRIORITY.LOW, dueDate: d(10) },
    { title: 'Accessibility audit', status: STATUS.BACKLOG, priority: PRIORITY.LOW, dueDate: d(14) },
  ];
  for (const t of p1Tasks) {
    await tasksApi.create(p1.id, {
      ...t,
      description: 'Part of the Q3 product redesign initiative.',
      assignee: userId,
      assigneeName: 'Demo User',
      createdBy: userId,
    });
  }

  // Seed tasks for p2
  const p2Tasks = [
    { title: 'Set up API service layer', status: STATUS.DONE, priority: PRIORITY.URGENT, dueDate: d(-8) },
    { title: 'Auth token refresh flow', status: STATUS.IN_PROGRESS, priority: PRIORITY.HIGH, dueDate: d(1) },
    { title: 'Error boundary handling', status: STATUS.TODO, priority: PRIORITY.MEDIUM, dueDate: d(6) },
    { title: 'Write API integration tests', status: STATUS.BACKLOG, priority: PRIORITY.LOW, dueDate: d(20) },
  ];
  for (const t of p2Tasks) {
    await tasksApi.create(p2.id, {
      ...t,
      description: 'Backend integration work.',
      assignee: userId,
      assigneeName: 'Demo User',
      createdBy: userId,
    });
  }

  // Seed tasks for p3
  const p3Tasks = [
    { title: 'Write hero section copy', status: STATUS.DONE, priority: PRIORITY.HIGH, dueDate: d(-3) },
    { title: 'SEO meta tags on all pages', status: STATUS.IN_PROGRESS, priority: PRIORITY.MEDIUM, dueDate: d(3) },
    { title: 'Blog setup with MDX', status: STATUS.TODO, priority: PRIORITY.LOW, dueDate: d(12) },
  ];
  for (const t of p3Tasks) {
    await tasksApi.create(p3.id, {
      ...t,
      description: 'Marketing website improvements.',
      assignee: userId,
      assigneeName: 'Demo User',
      createdBy: userId,
    });
  }

  console.log('✅ Demo data seeded successfully');
}
