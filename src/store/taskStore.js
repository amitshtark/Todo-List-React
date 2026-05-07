import { create } from 'zustand';
import { tasksApi } from '../services/api.js';
import { PRIORITY, STATUS, PRIORITY_ORDER } from '../utils/constants.js';

const useTaskStore = create((set, get) => ({
  tasksByProject: {},    // { projectId: Task[] }
  loading: false,
  error: null,
  activeTaskId: null,

  // Filters & sort
  filters: {
    status: [],
    priority: [],
    search: '',
  },
  sortBy: 'createdAt_desc',

  async fetchTasks(projectId) {
    set({ loading: true, error: null });
    try {
      const tasks = await tasksApi.getAll(projectId);
      set(state => ({
        tasksByProject: { ...state.tasksByProject, [projectId]: tasks },
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  async createTask(projectId, data) {
    try {
      const task = await tasksApi.create(projectId, data);
      set(state => ({
        tasksByProject: {
          ...state.tasksByProject,
          [projectId]: [task, ...(state.tasksByProject[projectId] || [])],
        },
      }));
      return task;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  async updateTask(projectId, id, data) {
    try {
      const updated = await tasksApi.update(projectId, id, data);
      set(state => ({
        tasksByProject: {
          ...state.tasksByProject,
          [projectId]: (state.tasksByProject[projectId] || []).map(t =>
            t.id === id ? updated : t
          ),
        },
      }));
      return updated;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  async deleteTask(projectId, id) {
    try {
      await tasksApi.delete(projectId, id);
      set(state => ({
        tasksByProject: {
          ...state.tasksByProject,
          [projectId]: (state.tasksByProject[projectId] || []).filter(t => t.id !== id),
        },
        activeTaskId: state.activeTaskId === id ? null : state.activeTaskId,
      }));
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  async addComment(projectId, taskId, comment) {
    try {
      const updated = await tasksApi.addComment(projectId, taskId, comment);
      set(state => ({
        tasksByProject: {
          ...state.tasksByProject,
          [projectId]: (state.tasksByProject[projectId] || []).map(t =>
            t.id === taskId ? updated : t
          ),
        },
      }));
      return updated;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  setActiveTask(id) {
    set({ activeTaskId: id });
  },

  getActiveTask(projectId) {
    const { tasksByProject, activeTaskId } = get();
    return (tasksByProject[projectId] || []).find(t => t.id === activeTaskId) || null;
  },

  setFilter(key, value) {
    set(state => ({ filters: { ...state.filters, [key]: value } }));
  },

  clearFilters() {
    set({ filters: { status: [], priority: [], search: '' } });
  },

  setSortBy(value) {
    set({ sortBy: value });
  },

  getFilteredTasks(projectId) {
    const { tasksByProject, filters, sortBy } = get();
    let tasks = tasksByProject[projectId] || [];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      tasks = tasks.filter(t =>
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
      );
    }
    if (filters.status.length > 0) {
      tasks = tasks.filter(t => filters.status.includes(t.status));
    }
    if (filters.priority.length > 0) {
      tasks = tasks.filter(t => filters.priority.includes(t.priority));
    }

    const [field, dir] = sortBy.split('_');
    tasks = [...tasks].sort((a, b) => {
      let aVal, bVal;
      if (field === 'priority') {
        aVal = PRIORITY_ORDER[a.priority] || 0;
        bVal = PRIORITY_ORDER[b.priority] || 0;
      } else if (field === 'title') {
        aVal = (a.title || '').toLowerCase();
        bVal = (b.title || '').toLowerCase();
      } else {
        aVal = new Date(a[field] || 0).getTime();
        bVal = new Date(b[field] || 0).getTime();
      }
      if (dir === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return tasks;
  },

  clearError() {
    set({ error: null });
  },
}));

export default useTaskStore;
