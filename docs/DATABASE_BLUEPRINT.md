# Database Blueprint - PostgreSQL

Full schema will be implemented progressively starting Phase 52.

## Authentication
- users (id, email, username, displayName, password_hash, avatar, plan, credits, wallet_balance, email_verified, onboarding_completed, role, created_at, last_login_at)
- roles, permissions, role_permissions, user_roles
- auth_sessions, oauth_accounts, email_verifications, password_resets

## Workspace
- workspaces, teams, team_members, workspace_members

## Creative
- projects (id, user_id, title, description, thumbnail, status, cultural_mode, language, genre, settings jsonb, created_at, updated_at)
- stories (id, project_id, title, logline, synopsis, full_story, genre, tone, cultural_mode, target_audience, estimated_duration, word_count, current_version_id)
- story_versions (id, story_id, version, content, change_notes)
- series, seasons, episodes
- characters (id, project_id, name, role, age, gender, description, personality, backstory, appearance, voice_id, locked, created_at)
- character_relationships, character_references
- scenes (id, project_id, index, title, description, location, time_of_day, mood, duration, dialogue jsonb, action, image_prompt, image_url, voice_url, video_url, status)
- scene_characters
- assets (id, project_id, type, url, thumbnail_url, name, size, mime_type, metadata jsonb)

## AI
- generations, generation_jobs, video_jobs
- ai_providers, ai_models, provider_routes, provider_usage, provider_health
- voices, music_tracks, sound_effects

## Editing
- timelines, timeline_tracks, timeline_items
- subtitle_tracks, subtitle_entries
- exports

## Monetization
- credits, credit_transactions (id, user_id, amount, type, description, balance_after)
- wallets, wallet_transactions
- subscription_plans, subscriptions
- payments, payment_webhooks

## Platform
- features (key, enabled, plans, credit_cost, daily_limit, model, provider)
- feature_plans, system_settings

## Advertising
- advertisements, ad_campaigns, ad_impressions, ad_clicks, ad_rewards

## Marketing
- promotion_campaigns, coupons, coupon_redemptions, promo_codes, promo_code_usage, marketing_templates

## Communication
- system_announcements, announcement_campaigns, announcement_recipients, announcement_deliveries
- notifications, notification_templates, notification_preferences, notification_deliveries, notification_events
- push_subscriptions, whatsapp_contacts, whatsapp_messages, email_logs, sms_logs

## Business
- brand_kits, marketplace_items, marketplace_orders, referral_codes, referrals

## Advanced AI
- content_calendars, content_ideas, auto_clip_jobs, auto_clips, agent_jobs, viral_analyses

## Analytics/Security
- analytics_events, analytics_daily, audit_logs

## Implementation Order
- Phase 52: users, projects, stories, characters, scenes
- Phase 55-56: ai_providers, generations, assets
- Phase 60-62: credits, wallets, subscriptions, payments
- Phase 64-66: notifications, announcements, ads
- Later: advanced tables as features need them
