CREATE TABLE IF NOT EXISTS admin_users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_salt VARCHAR(128) NOT NULL,
  password_hash VARCHAR(256) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash CHAR(64) PRIMARY KEY,
  admin_user_id VARCHAR(36) NOT NULL,
  expires_at DATETIME(3) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_admin_sessions_expiry (expires_at),
  CONSTRAINT fk_admin_sessions_user FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS invitations (
  id VARCHAR(36) PRIMARY KEY,
  slug VARCHAR(191) NOT NULL UNIQUE,
  client_name VARCHAR(255) NOT NULL DEFAULT '',
  theme_id VARCHAR(80) NOT NULL DEFAULT 'botanical-serenity',
  groom_name VARCHAR(160) NOT NULL,
  groom_full_name VARCHAR(255) NOT NULL,
  bride_name VARCHAR(160) NOT NULL,
  bride_full_name VARCHAR(255) NOT NULL,
  groom_parents TEXT NOT NULL,
  bride_parents TEXT NOT NULL,
  event_date VARCHAR(50) NOT NULL,
  akad_time VARCHAR(160) NOT NULL DEFAULT '',
  reception_time VARCHAR(160) NOT NULL DEFAULT '',
  venue_name VARCHAR(255) NOT NULL DEFAULT '',
  venue_address TEXT NOT NULL,
  map_url TEXT NOT NULL,
  opening_text TEXT NOT NULL,
  story_text TEXT NOT NULL,
  closing_text TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  hero_edit_json TEXT NULL,
  template_settings_json TEXT NULL,
  section_settings_json TEXT NULL,
  project_status VARCHAR(32) NOT NULL DEFAULT 'draft',
  publication_status VARCHAR(20) NOT NULL DEFAULT 'draft',
  review_status VARCHAR(24) NOT NULL DEFAULT 'not_sent',
  review_token VARCHAR(64) NOT NULL DEFAULT '',
  preview_token VARCHAR(64) NOT NULL DEFAULT '',
  published_at DATETIME(3) NULL,
  expires_at DATETIME(3) NULL,
  music_url TEXT NOT NULL,
  feature_website TINYINT(1) NOT NULL DEFAULT 1,
  feature_guestbook TINYINT(1) NOT NULL DEFAULT 0,
  feature_frame TINYINT(1) NOT NULL DEFAULT 0,
  guestbook_pin VARCHAR(12) NOT NULL DEFAULT '',
  frame_preset VARCHAR(32) NOT NULL DEFAULT 'heritage',
  frame_names VARCHAR(255) NOT NULL DEFAULT '',
  frame_date_label VARCHAR(120) NOT NULL DEFAULT '',
  frame_overlay INT NOT NULL DEFAULT 22,
  whatsapp_template MEDIUMTEXT NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gallery_items (
  id VARCHAR(36) PRIMARY KEY,
  invitation_id VARCHAR(36) NOT NULL,
  url TEXT NOT NULL,
  caption VARCHAR(255) NOT NULL DEFAULT '',
  edit_json TEXT NULL,
  position INT NOT NULL DEFAULT 0,
  INDEX idx_gallery_invitation (invitation_id, position),
  CONSTRAINT fk_gallery_invitation FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS guests (
  id VARCHAR(36) PRIMARY KEY,
  invitation_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(40) NOT NULL DEFAULT '',
  guest_group VARCHAR(160) NOT NULL DEFAULT 'Umum',
  token VARCHAR(191) NOT NULL UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'Belum dibuka',
  invited_pax INT NOT NULL DEFAULT 1,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_guests_invitation (invitation_id),
  INDEX idx_guests_token (token),
  CONSTRAINT fk_guests_invitation FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rsvps (
  id VARCHAR(36) PRIMARY KEY,
  invitation_id VARCHAR(36) NOT NULL,
  guest_id VARCHAR(36) NULL,
  guest_name VARCHAR(255) NOT NULL,
  attendance ENUM('Hadir', 'Tidak hadir') NOT NULL,
  pax INT NOT NULL DEFAULT 1,
  message TEXT NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_rsvp_guest (invitation_id, guest_id),
  INDEX idx_rsvps_invitation (invitation_id, created_at),
  CONSTRAINT fk_rsvps_invitation FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE,
  CONSTRAINT fk_rsvps_guest FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE SET NULL,
  CONSTRAINT chk_rsvp_pax CHECK (pax >= 1 AND pax <= 20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS guest_checkins (
  id VARCHAR(36) PRIMARY KEY,
  invitation_id VARCHAR(36) NOT NULL,
  guest_id VARCHAR(36) NOT NULL,
  pax INT NOT NULL DEFAULT 1,
  source VARCHAR(20) NOT NULL DEFAULT 'operator',
  checked_in_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_guest_checkin (invitation_id, guest_id),
  INDEX idx_checkins_invitation_time (invitation_id, checked_in_at),
  CONSTRAINT fk_checkins_invitation FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE,
  CONSTRAINT fk_checkins_guest FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE,
  CONSTRAINT chk_checkin_pax CHECK (pax >= 1 AND pax <= 20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS client_review_notes (
  id VARCHAR(36) PRIMARY KEY,
  invitation_id VARCHAR(36) NOT NULL,
  author ENUM('admin','client') NOT NULL DEFAULT 'admin',
  kind ENUM('comment','revision','approval','system') NOT NULL DEFAULT 'comment',
  section_key VARCHAR(80) NOT NULL DEFAULT 'general',
  message TEXT NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_review_notes_invitation (invitation_id, created_at),
  CONSTRAINT fk_review_notes_invitation FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
