import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";
import { CookiePreferencesManager, useCookiePreferences, CookiePreferences } from "../utils/cookiePreferences";

// Cookie SVG Icon
const CookieIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-md"
  >
    <circle cx="16" cy="16" r="16" fill="#F5D28E" />
    <circle cx="10" cy="12" r="2" fill="#B57B2E" />
    <circle cx="20" cy="10" r="1.5" fill="#B57B2E" />
    <circle cx="22" cy="18" r="1.2" fill="#B57B2E" />
    <circle cx="14" cy="20" r="1.5" fill="#B57B2E" />
    <circle cx="18" cy="15" r="1" fill="#B57B2E" />
    <circle cx="12" cy="16" r="0.8" fill="#B57B2E" />
  </svg>
);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8024/api/v1";

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const tabs: TabConfig[] = [
  {
    id: "appearance",
    label: "Appearance",
    icon: <span className="w-4 h-4 text-center">🎨</span>,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <span className="w-4 h-4 text-center">🔔</span>,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "privacy",
    label: "Privacy",
    icon: <span className="w-4 h-4 text-center">🛡️</span>,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    id: "security",
    label: "Security",
    icon: <span className="w-4 h-4 text-center">🔒</span>,
    color: "from-red-500 to-red-600",
  },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <span className="w-4 h-4 text-center">⚙️</span>,
    color: "from-amber-500 to-amber-600",
  },
];

const Preferences: React.FC = () => {
  const { state } = useAuth();
  const { preferences, setPreference } = useCookiePreferences();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("appearance");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [localPrefs, setLocalPrefs] = useState<CookiePreferences>(preferences);

  // Sync local state with cookie preferences when component mounts
  useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences]);

  // Load server preferences when modal opens
  useEffect(() => {
    if (isOpen && state.user) {
      loadServerPreferences();
    }
  }, [isOpen, state.user]);

  const loadServerPreferences = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get(`${API_URL}/preferences/me`, { 
        withCredentials: true 
      }) as any;
      
      if (response?.data?.preferences) {
        // Merge server preferences with local cookie preferences
        const serverPrefs = response.data.preferences;
        const mergedPrefs = { ...preferences, ...serverPrefs };
        setLocalPrefs(mergedPrefs);
        
        // Update cookies with server data
        CookiePreferencesManager.setPreferences(mergedPrefs);
      }
    } catch (error) {
      console.log("Using cookie preferences (server preferences not available)");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = <K extends keyof CookiePreferences>(
    key: K,
    value: CookiePreferences[K]
  ) => {
    setLocalPrefs(prev => ({ ...prev, [key]: value }));
    setPreference(key, value);
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    setIsSaving(true);

    try {
      // Save to server
      await apiService.patch(`${API_URL}/preferences/me`, localPrefs, {
        withCredentials: true,
      });

      // Save to cookies (already done in real-time, but ensure consistency)
      CookiePreferencesManager.setPreferences(localPrefs);
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      
      // Close modal after successful save
      setTimeout(() => setIsOpen(false), 1000);
    } catch (error) {
      console.error("Failed to save preferences to server:", error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      
      // Even if server save fails, preferences are still saved in cookies
      alert("Preferences saved locally. Server sync will be attempted later.");
    } finally {
      setIsSaving(false);
    }
  };

  const ToggleSwitch: React.FC<{
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    disabled?: boolean;
  }> = ({ enabled, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        enabled ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading preferences...</span>
        </div>
      );
    }

    switch (activeTab) {
      case "appearance":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'system', label: 'System' },
                ].map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => handlePreferenceChange('theme', theme.value as CookiePreferences['theme'])}
                    className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                      localPrefs.theme === theme.value
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <span className="text-xs mt-1">{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                value={localPrefs.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <select
                value={localPrefs.timezone}
                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="UTC">UTC</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Format
              </label>
              <select
                value={localPrefs.dateFormat}
                onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-4">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email', icon: <span>📧</span> },
              { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications', icon: <span>📱</span> },
              { key: 'assignmentReminders', label: 'Assignment Reminders', description: 'Reminders for upcoming assignments', icon: <span>🔔</span> },
              { key: 'evaluationDeadlines', label: 'Evaluation Deadlines', description: 'Notifications for evaluation deadlines', icon: <span>⏰</span> },
              { key: 'weeklyReports', label: 'Weekly Reports', description: 'Weekly progress summaries', icon: <span>📊</span> },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="text-gray-500 dark:text-gray-400">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  enabled={localPrefs[item.key as keyof CookiePreferences] as boolean}
                  onChange={(value) => handlePreferenceChange(item.key as keyof CookiePreferences, value)}
                />
              </div>
            ))}
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Visibility
              </label>
              <select
                value={localPrefs.profileVisibility}
                onChange={(e) => handlePreferenceChange('profileVisibility', e.target.value as CookiePreferences['profileVisibility'])}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="public">Public</option>
                <option value="peers">Peers Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="space-y-4">
              {[
                { key: 'showEmail', label: 'Show Email Address', description: 'Display email on your profile' },
                { key: 'showPhone', label: 'Show Phone Number', description: 'Display phone on your profile' },
                { key: 'allowPeerContact', label: 'Allow Peer Contact', description: 'Let peers contact you directly' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                  <ToggleSwitch
                    enabled={localPrefs[item.key as keyof CookiePreferences] as boolean}
                    onChange={(value) => handlePreferenceChange(item.key as keyof CookiePreferences, value)}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  Two-Factor Authentication
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Add an extra layer of security (Coming Soon)
                </p>
              </div>
              <ToggleSwitch
                enabled={localPrefs.twoFactorEnabled}
                onChange={(value) => handlePreferenceChange('twoFactorEnabled', value)}
                disabled={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Session Timeout (minutes)
              </label>
              <select
                value={localPrefs.sessionTimeout}
                onChange={(e) => handlePreferenceChange('sessionTimeout', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="0">Never</option>
              </select>
            </div>
          </div>
        );

      case "dashboard":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default View
              </label>
              <select
                value={localPrefs.dashboardDefaultView}
                onChange={(e) => handlePreferenceChange('dashboardDefaultView', e.target.value as CookiePreferences['dashboardDefaultView'])}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="overview">Overview</option>
                <option value="assignments">Assignments</option>
                <option value="evaluations">Evaluations</option>
              </select>
            </div>

            <div className="space-y-4">
              {[
                { key: 'showStats', label: 'Show Statistics', description: 'Display performance statistics on dashboard' },
                { key: 'showRecentActivity', label: 'Show Recent Activity', description: 'Display recent activity feed' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                  <ToggleSwitch
                    enabled={localPrefs[item.key as keyof CookiePreferences] as boolean}
                    onChange={(value) => handlePreferenceChange(item.key as keyof CookiePreferences, value)}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating Cookie Button - Positioned on the right side */}
      <motion.button
        aria-label="Open Preferences"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <CookieIcon />
      </motion.button>

      {/* Preferences Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed bottom-20 right-6 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-96 max-h-[80vh] overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <CookieIcon />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Preferences
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <span className="text-lg">✕</span>
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                <div className="flex space-x-1 p-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? `bg-gradient-to-r ${tab.color} text-white`
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-96 overflow-y-auto">
                {renderTabContent()}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                {saveStatus === 'error' && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Failed to sync with server
                  </p>
                )}
                {saveStatus === 'saved' && (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                    <span className="mr-1">✓</span>
                    Saved successfully
                  </p>
                )}
                {saveStatus === 'idle' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Changes saved automatically
                  </p>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    {isSaving ? (
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : saveStatus === 'saved' ? (
                      <span>✓</span>
                    ) : (
                      <span>💾</span>
                    )}
                    <span>
                      {isSaving ? 'Syncing...' : saveStatus === 'saved' ? 'Synced!' : 'Sync'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Preferences;