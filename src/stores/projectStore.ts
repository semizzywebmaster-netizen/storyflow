import { create } from 'zustand'
import type { Project } from '@/types'

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  isLoading: boolean
  error: string | null

  setProjects: (projects: Project[]) => void
  setCurrentProject: (project: Project | null) => void
  addProject: (project: Project) => void
  updateProject: (id: string, data: Partial<Project>) => void
  removeProject: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  setProjects: (projects) => set({ projects }),
  setCurrentProject: (currentProject) => set({ currentProject }),
  addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
  updateProject: (id, data) => set((state) => ({
    projects: state.projects.map(p => p.id === id ? { ...p, ...data } : p),
    currentProject: state.currentProject?.id === id ? { ...state.currentProject, ...data } as Project : state.currentProject
  })),
  removeProject: (id) => set((state) => ({
    projects: state.projects.filter(p => p.id !== id),
    currentProject: state.currentProject?.id === id ? null : state.currentProject
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}))
