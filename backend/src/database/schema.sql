
-- AI Story Studio - PostgreSQL Schema (Phase 52)
-- Production-ready with indexes, constraints, JSONB, soft delete, timestamps

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE,
  display_name VARCHAR(255),
  password_hash VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  plan VARCHAR(20) DEFAULT 'FREE' CHECK (plan IN ('FREE','CREATOR','PRO','AGENCY')),
  credits INT DEFAULT 50 CHECK (credits >= 0),
  wallet_balance DECIMAL(12,2) DEFAULT 0 CHECK (wallet_balance >= 0),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_plan ON users(plan);

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  resource VARCHAR(100),
  action VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE auth_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_auth_sessions_user ON auth_sessions(user_id);
CREATE INDEX idx_auth_sessions_expires ON auth_sessions(expires_at);

CREATE TABLE oauth_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  provider VARCHAR(50) NOT NULL,
  provider_user_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider, provider_user_id)
);

-- Workspace
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  genre VARCHAR(50),
  cultural_mode VARCHAR(50),
  status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','IN_PROGRESS','COMPLETED','ARCHIVED')),
  thumbnail_url TEXT,
  metadata JSONB DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);

CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255),
  synopsis TEXT,
  full_story TEXT,
  script TEXT,
  genre VARCHAR(50),
  tone VARCHAR(50),
  length_minutes INT,
  language VARCHAR(10) DEFAULT 'en',
  version INT DEFAULT 1,
  word_count INT,
  is_current BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_stories_project ON stories(project_id);

CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('PROTAGONIST','ANTAGONIST','SUPPORTING','EXTRA')),
  age INT,
  gender VARCHAR(20),
  appearance TEXT,
  personality TEXT,
  background TEXT,
  clothing_style TEXT,
  skin_tone VARCHAR(50),
  hair_style VARCHAR(100),
  voice_id UUID,
  is_locked BOOLEAN DEFAULT FALSE,
  reference_images JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_characters_project ON characters(project_id);

CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  story_id UUID REFERENCES stories(id) ON DELETE SET NULL,
  scene_index INT NOT NULL,
  title VARCHAR(255),
  location VARCHAR(255),
  time_of_day VARCHAR(20),
  action TEXT,
  dialogue TEXT,
  narration TEXT,
  emotion VARCHAR(50),
  camera_angle VARCHAR(50),
  visual_style VARCHAR(50),
  visual_prompt TEXT,
  music_track_id UUID,
  sfx_ids JSONB DEFAULT '[]',
  duration_seconds INT DEFAULT 10,
  transition VARCHAR(50),
  status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','IN_PROGRESS','COMPLETED','FAILED')),
  assets JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, scene_index)
);
CREATE INDEX idx_scenes_project ON scenes(project_id);

-- Assets & Generations
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  scene_id UUID REFERENCES scenes(id) ON DELETE SET NULL,
  type VARCHAR(20) CHECK (type IN ('IMAGE','VIDEO','AUDIO','MUSIC','SFX','THUMBNAIL','POSTER','SUBTITLE')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size BIGINT,
  mime_type VARCHAR(100),
  width INT,
  height INT,
  duration_seconds INT,
  prompt TEXT,
  model VARCHAR(100),
  is_favorite BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_assets_user ON assets(user_id);
CREATE INDEX idx_assets_project ON assets(project_id);
CREATE INDEX idx_assets_type ON assets(type);

CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  type VARCHAR(20) CHECK (type IN ('STORY','CHARACTER','IMAGE','VOICE','MUSIC','VIDEO','SUBTITLE','THUMBNAIL','SOCIAL')),
  prompt TEXT,
  provider VARCHAR(50),
  model VARCHAR(100),
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING','PROCESSING','COMPLETED','FAILED','CANCELLED')),
  credits_reserved INT DEFAULT 0,
  credits_consumed INT DEFAULT 0,
  result_url TEXT,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_generations_user ON generations(user_id);
CREATE INDEX idx_generations_status ON generations(status);

-- AI Provider Management
CREATE TABLE ai_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(20) CHECK (type IN ('TEXT','IMAGE','VIDEO','VOICE','MUSIC')),
  is_enabled BOOLEAN DEFAULT TRUE,
  api_key_encrypted TEXT,
  base_url TEXT,
  priority INT DEFAULT 100,
  cost_per_unit DECIMAL(10,6),
  quota_limit INT,
  quota_used INT DEFAULT 0,
  health_status VARCHAR(20) DEFAULT 'UNKNOWN' CHECK (health_status IN ('HEALTHY','DEGRADED','DOWN','UNKNOWN')),
  last_health_check TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES ai_providers(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(255),
  is_enabled BOOLEAN DEFAULT TRUE,
  cost_per_unit DECIMAL(10,6),
  max_tokens INT,
  supports JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credits & Wallet (Financial Safety - Transactions)
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount INT NOT NULL,
  type VARCHAR(20) CHECK (type IN ('PURCHASE','GENERATION','BONUS','REFUND','ADMIN_ADJUSTMENT','SUBSCRIPTION')),
  description TEXT,
  reference_id UUID,
  balance_after INT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_credit_tx_user ON credit_transactions(user_id);
CREATE INDEX idx_credit_tx_type ON credit_transactions(type);

CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  balance DECIMAL(12,2) DEFAULT 0 CHECK (balance >= 0),
  total_funded DECIMAL(12,2) DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('FUND','PURCHASE','SUBSCRIPTION','CREDIT_BUY','REFUND','BONUS')),
  status VARCHAR(20) DEFAULT 'COMPLETED' CHECK (status IN ('PENDING','COMPLETED','FAILED','REFUNDED')),
  payment_provider VARCHAR(20) CHECK (payment_provider IN ('PAYSTACK','FLUTTERWAVE','WALLET')),
  payment_reference VARCHAR(255) UNIQUE,
  idempotency_key VARCHAR(255) UNIQUE,
  balance_after DECIMAL(12,2) NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_wallet_tx_wallet ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_tx_payment_ref ON wallet_transactions(payment_reference);
CREATE INDEX idx_wallet_tx_idempotency ON wallet_transactions(idempotency_key);

-- Subscriptions
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(20) UNIQUE CHECK (name IN ('FREE','CREATOR','PRO','AGENCY')) NOT NULL,
  display_name VARCHAR(50),
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  credits_monthly INT,
  features JSONB DEFAULT '[]',
  limits JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES subscription_plans(id) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('ACTIVE','CANCELLED','EXPIRED','PENDING')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NGN',
  provider VARCHAR(20) CHECK (provider IN ('PAYSTACK','FLUTTERWAVE')),
  provider_reference VARCHAR(255) UNIQUE,
  idempotency_key VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(20) CHECK (type IN ('WALLET_FUND','CREDIT_PURCHASE','SUBSCRIPTION')),
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING','SUCCESS','FAILED','ABANDONED')),
  verified BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_reference ON payments(provider_reference);
CREATE INDEX idx_payments_idempotency ON payments(idempotency_key);

-- Features Control
CREATE TABLE features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255),
  description TEXT,
  is_enabled BOOLEAN DEFAULT TRUE,
  plans JSONB DEFAULT '["FREE","CREATOR","PRO","AGENCY"]',
  credit_cost INT DEFAULT 0,
  daily_limit INT,
  monthly_limit INT,
  provider VARCHAR(50),
  model VARCHAR(100),
  priority INT DEFAULT 100,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE system_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Master Kill Switch
INSERT INTO system_settings (key, value, description) VALUES ('MASTER_AI_KILL_SWITCH', 'false', 'Global kill switch for all AI operations') ON CONFLICT (key) DO NOTHING;

-- Marketing & Ads
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) CHECK (discount_type IN ('PERCENTAGE','FIXED','BONUS_CREDITS','FREE_FEATURE')),
  discount_value DECIMAL(10,2),
  max_uses INT,
  used_count INT DEFAULT 0,
  min_purchase_amount DECIMAL(10,2),
  eligible_plans JSONB DEFAULT '[]',
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- Analytics
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100),
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
