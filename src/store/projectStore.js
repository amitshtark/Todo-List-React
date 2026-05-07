import { create } from 'zustand';
import { projectsApi } from '../services/api.js';

const useProjectStore = create((set, get) => ({
  projects: [],
  loading: false,
  error: null,
  activeProjectId: null,

  async fetchProjects(userId) {
    set({ loading: true, error: null });
    try {
      const projects = await projectsApi.getAll(userId);
      set({ projects, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  async createProject(userId, data) {
    set({ loading: true, error: null });
    try {
      const project = await projectsApi.create(userId, data);
      set(state => ({ projects: [project, ...state.projects], loading: false }));
      return project;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  async updateProject(userId, id, data) {
    try {
      const updated = await projectsApi.update(userId, id, data);
      set(state => ({
        projects: state.projects.map(p => p.id === id ? updated : p),
      }));
      return updated;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  async deleteProject(userId, id) {
    try {
      await projectsApi.delete(userId, id);
      set(state => ({
        projects: state.projects.filter(p => p.id !== id),
        activeProjectId: state.activeProjectId === id ? null : state.activeProjectId,
      }));
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  setActiveProject(id) {
    set({ activeProjectId: id });
  },

  getActiveProject() {
    const { projects, activeProjectId } = get();
    return projects.find(p => p.id === activeProjectId) || null;
  },

  clearError() {
    set({ error: null });
  },
}));

export default useProjectStore;
