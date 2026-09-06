-- Phase 8.18: Video Editor & Timeline
CREATE TABLE IF NOT EXISTS video_timelines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  timeline JSONB NOT NULL DEFAULT '{"tracks":[]}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_video_timelines_user ON video_timelines(user_id);
CREATE INDEX IF NOT EXISTS idx_video_timelines_project ON video_timelines(project_id);
