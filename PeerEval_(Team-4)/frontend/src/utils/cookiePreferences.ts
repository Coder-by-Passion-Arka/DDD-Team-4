import Cookies from 'js-cookie';
import React from 'react';

// Common preferences that should be stored in cookies for immediate loading
export interface CookiePreferences {
  // Appearance Settings (common to both)
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat?: string;
  
  // Notification Settings (common to both)
  emailNotifications: boolean;
  pushNotifications: boolean;
  assignmentReminders: boolean;
  evaluationDeadlines: boolean;
  weeklyReports: boolean;
  
  // Privacy Settings (common to both)
  profileVisibility: 'public' | 'peers' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  allowPeerContact: boolean;
  
  // Security Settings (common to both)
  twoFactorEnabled: boolean;
  sessionTimeout: string;
  
  // Dashboard Settings (from Preferences)
  dashboardDefaultView: 'overview' | 'assignments' | 'evaluations';
  showStats: boolean;
  showRecentActivity: boolean;
}

// Default preferences
export const defaultCookiePreferences: CookiePreferences = {
  // Appearance
  theme: 'system',
  language: 'en',
  timezone: 'America/New_York',
  dateFormat: 'MM/DD/YYYY',
  
  // Notifications
  emailNotifications: true,
  pushNotifications: true,
  assignmentReminders: true,
  evaluationDeadlines: true,
  weeklyReports: false,
  
  // Privacy
  profileVisibility: 'public',
  showEmail: false,
  showPhone: false,
  allowPeerContact: true,
  
  // Security
  twoFactorEnabled: false,
  sessionTimeout: '30',
  
  // Dashboard
  dashboardDefaultView: 'overview',
  showStats: true,
  showRecentActivity: true,
};

// Cookie configuration
const COOKIE_CONFIG = {
  expires: 365, // 1 year
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

// Keys for individual preference cookies
const COOKIE_KEYS = {
  THEME: 'peereval_theme',
  LANGUAGE: 'peereval_language',
  TIMEZONE: 'peereval_timezone',
  DATE_FORMAT: 'peereval_date_format',
  EMAIL_NOTIFICATIONS: 'peereval_email_notifications',
  PUSH_NOTIFICATIONS: 'peereval_push_notifications',
  ASSIGNMENT_REMINDERS: 'peereval_assignment_reminders',
  EVALUATION_DEADLINES: 'peereval_evaluation_deadlines',
  WEEKLY_REPORTS: 'peereval_weekly_reports',
  PROFILE_VISIBILITY: 'peereval_profile_visibility',
  SHOW_EMAIL: 'peereval_show_email',
  SHOW_PHONE: 'peereval_show_phone',
  ALLOW_PEER_CONTACT: 'peereval_allow_peer_contact',
  TWO_FACTOR_ENABLED: 'peereval_two_factor_enabled',
  SESSION_TIMEOUT: 'peereval_session_timeout',
  DASHBOARD_DEFAULT_VIEW: 'peereval_dashboard_default_view',
  SHOW_STATS: 'peereval_show_stats',
  SHOW_RECENT_ACTIVITY: 'peereval_show_recent_activity',
} as const;

// Utility functions for cookie management
export class CookiePreferencesManager {
  
  // Get all preferences from cookies
  static getPreferences(): CookiePreferences {
    const getBooleanCookie = (key: string, defaultValue: boolean): boolean => {
      const value = Cookies.get(key);
      return value !== undefined ? value === 'true' : defaultValue;
    };

    return {
      theme: (Cookies.get(COOKIE_KEYS.THEME) as CookiePreferences['theme']) || defaultCookiePreferences.theme,
      language: Cookies.get(COOKIE_KEYS.LANGUAGE) || defaultCookiePreferences.language,
      timezone: Cookies.get(COOKIE_KEYS.TIMEZONE) || defaultCookiePreferences.timezone,
      dateFormat: Cookies.get(COOKIE_KEYS.DATE_FORMAT) || defaultCookiePreferences.dateFormat,
      emailNotifications: getBooleanCookie(COOKIE_KEYS.EMAIL_NOTIFICATIONS, defaultCookiePreferences.emailNotifications),
      pushNotifications: getBooleanCookie(COOKIE_KEYS.PUSH_NOTIFICATIONS, defaultCookiePreferences.pushNotifications),
      assignmentReminders: getBooleanCookie(COOKIE_KEYS.ASSIGNMENT_REMINDERS, defaultCookiePreferences.assignmentReminders),
      evaluationDeadlines: getBooleanCookie(COOKIE_KEYS.EVALUATION_DEADLINES, defaultCookiePreferences.evaluationDeadlines),
      weeklyReports: getBooleanCookie(COOKIE_KEYS.WEEKLY_REPORTS, defaultCookiePreferences.weeklyReports),
      profileVisibility: (Cookies.get(COOKIE_KEYS.PROFILE_VISIBILITY) as CookiePreferences['profileVisibility']) || defaultCookiePreferences.profileVisibility,
      showEmail: getBooleanCookie(COOKIE_KEYS.SHOW_EMAIL, defaultCookiePreferences.showEmail),
      showPhone: getBooleanCookie(COOKIE_KEYS.SHOW_PHONE, defaultCookiePreferences.showPhone),
      allowPeerContact: getBooleanCookie(COOKIE_KEYS.ALLOW_PEER_CONTACT, defaultCookiePreferences.allowPeerContact),
      twoFactorEnabled: getBooleanCookie(COOKIE_KEYS.TWO_FACTOR_ENABLED, defaultCookiePreferences.twoFactorEnabled),
      sessionTimeout: Cookies.get(COOKIE_KEYS.SESSION_TIMEOUT) || defaultCookiePreferences.sessionTimeout,
      dashboardDefaultView: (Cookies.get(COOKIE_KEYS.DASHBOARD_DEFAULT_VIEW) as CookiePreferences['dashboardDefaultView']) || defaultCookiePreferences.dashboardDefaultView,
      showStats: getBooleanCookie(COOKIE_KEYS.SHOW_STATS, defaultCookiePreferences.showStats),
      showRecentActivity: getBooleanCookie(COOKIE_KEYS.SHOW_RECENT_ACTIVITY, defaultCookiePreferences.showRecentActivity),
    };
  }

  // Set all preferences to cookies
  static setPreferences(preferences: Partial<CookiePreferences>): void {
    Object.entries(preferences).forEach(([key, value]) => {
      this.setPreference(key as keyof CookiePreferences, value);
    });
  }

  // Set individual preference
  static setPreference<K extends keyof CookiePreferences>(
    key: K,
    value: CookiePreferences[K]
  ): void {
    const cookieKey = this.getCookieKey(key);
    if (cookieKey) {
      Cookies.set(cookieKey, String(value), COOKIE_CONFIG);
    }
  }

  // Get individual preference
  static getPreference<K extends keyof CookiePreferences>(
    key: K
  ): CookiePreferences[K] {
    const cookieKey = this.getCookieKey(key);
    if (!cookieKey) return defaultCookiePreferences[key];

    const cookieValue = Cookies.get(cookieKey);
    if (!cookieValue) return defaultCookiePreferences[key];

    // Handle boolean values
    if (typeof defaultCookiePreferences[key] === 'boolean') {
      return (cookieValue === 'true') as CookiePreferences[K];
    }

    return cookieValue as CookiePreferences[K];
  }

  // Clear all preference cookies
  static clearPreferences(): void {
    Object.values(COOKIE_KEYS).forEach(cookieKey => {
      Cookies.remove(cookieKey);
    });
  }

  // Apply theme preference immediately to document
  static applyTheme(theme: CookiePreferences['theme']): void {
    // Remove existing theme classes
    document.documentElement.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      // Use explicit theme
      document.documentElement.classList.add(theme);
    }
    
    // Set data attribute for compatibility
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Apply language preference
  static applyLanguage(language: string): void {
    document.documentElement.lang = language;
    document.documentElement.setAttribute('data-language', language);
  }

  // Apply all visual preferences immediately
  static applyVisualPreferences(): void {
    const preferences = this.getPreferences();
    this.applyTheme(preferences.theme);
    this.applyLanguage(preferences.language);
  }

  // Get cookie key for preference
  private static getCookieKey(preferenceKey: keyof CookiePreferences): string | undefined {
    const keyMap: Record<keyof CookiePreferences, string> = {
      theme: COOKIE_KEYS.THEME,
      language: COOKIE_KEYS.LANGUAGE,
      timezone: COOKIE_KEYS.TIMEZONE,
      dateFormat: COOKIE_KEYS.DATE_FORMAT,
      emailNotifications: COOKIE_KEYS.EMAIL_NOTIFICATIONS,
      pushNotifications: COOKIE_KEYS.PUSH_NOTIFICATIONS,
      assignmentReminders: COOKIE_KEYS.ASSIGNMENT_REMINDERS,
      evaluationDeadlines: COOKIE_KEYS.EVALUATION_DEADLINES,
      weeklyReports: COOKIE_KEYS.WEEKLY_REPORTS,
      profileVisibility: COOKIE_KEYS.PROFILE_VISIBILITY,
      showEmail: COOKIE_KEYS.SHOW_EMAIL,
      showPhone: COOKIE_KEYS.SHOW_PHONE,
      allowPeerContact: COOKIE_KEYS.ALLOW_PEER_CONTACT,
      twoFactorEnabled: COOKIE_KEYS.TWO_FACTOR_ENABLED,
      sessionTimeout: COOKIE_KEYS.SESSION_TIMEOUT,
      dashboardDefaultView: COOKIE_KEYS.DASHBOARD_DEFAULT_VIEW,
      showStats: COOKIE_KEYS.SHOW_STATS,
      showRecentActivity: COOKIE_KEYS.SHOW_RECENT_ACTIVITY,
    };
    
    return keyMap[preferenceKey];
  }

  // Initialize preferences on app load
  static initializePreferences(): CookiePreferences {
    const preferences = this.getPreferences();
    this.applyVisualPreferences();
    return preferences;
  }

  // Sync preferences between cookies and component state
  static syncWithServerPreferences(serverPreferences: any): void {
    // This method would sync local cookie preferences with server-stored preferences
    // You can implement the logic to merge server preferences with local cookies
    const localPreferences = this.getPreferences();
    
    // Example: If server has newer preferences, update cookies
    if (serverPreferences) {
      const mergedPreferences = { ...localPreferences, ...serverPreferences };
      this.setPreferences(mergedPreferences);
    }
  }
}

// Hook for easy access to cookie preferences in React components
export const useCookiePreferences = () => {
  const [preferences, setPreferencesState] = React.useState<CookiePreferences>(
    CookiePreferencesManager.getPreferences()
  );

  const setPreferences = (newPreferences: Partial<CookiePreferences>) => {
    CookiePreferencesManager.setPreferences(newPreferences);
    setPreferencesState(CookiePreferencesManager.getPreferences());
    
    // Apply visual changes immediately
    if (newPreferences.theme) {
      CookiePreferencesManager.applyTheme(newPreferences.theme);
    }
    if (newPreferences.language) {
      CookiePreferencesManager.applyLanguage(newPreferences.language);
    }
  };

  const setPreference = <K extends keyof CookiePreferences>(
    key: K,
    value: CookiePreferences[K]
  ) => {
    CookiePreferencesManager.setPreference(key, value);
    setPreferencesState(CookiePreferencesManager.getPreferences());
    
    // Apply visual changes immediately
    if (key === 'theme') {
      CookiePreferencesManager.applyTheme(value as CookiePreferences['theme']);
    }
    if (key === 'language') {
      CookiePreferencesManager.applyLanguage(value as string);
    }
  };

  return {
    preferences,
    setPreferences,
    setPreference,
    clearPreferences: () => {
      CookiePreferencesManager.clearPreferences();
      setPreferencesState(CookiePreferencesManager.getPreferences());
    },
  };
};
