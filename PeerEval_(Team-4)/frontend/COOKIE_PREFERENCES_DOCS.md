# Cookie Preferences System Documentation

## Overview

The Cookie Preferences System provides a unified way to manage user preferences that need to be available immediately when the app loads, before the user logs in or before API calls are made. This includes theme, language, notification settings, and other UI preferences.

## Architecture

### Core Components

1. **`cookiePreferences.ts`** - Main utility for managing cookie-based preferences
2. **`Preferences.tsx`** - Floating cookie button component with modal interface  
3. **`App.tsx`** - Initialization of preferences on app startup

### Key Features

- ✅ **Immediate availability** - Preferences load instantly from cookies
- ✅ **Real-time sync** - Changes apply immediately to the UI
- ✅ **Server synchronization** - Optional syncing with backend preferences API
- ✅ **Fallback support** - Works even if server sync fails
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Cookie management** - Automatic cookie handling with expiration

## Common Settings Identified

From analyzing both `Settings.tsx` and `Preferences.tsx`, these are the common preferences that should be stored in cookies:

### Appearance Settings
- `theme`: 'light' | 'dark' | 'system'
- `language`: string (default: 'en')
- `timezone`: string (default: 'America/New_York')
- `dateFormat`: string (default: 'MM/DD/YYYY')

### Notification Settings
- `emailNotifications`: boolean (default: true)
- `pushNotifications`: boolean (default: true)
- `assignmentReminders`: boolean (default: true)
- `evaluationDeadlines`: boolean (default: true)
- `weeklyReports`: boolean (default: false)

### Privacy Settings
- `profileVisibility`: 'public' | 'peers' | 'private' (default: 'public')
- `showEmail`: boolean (default: false)
- `showPhone`: boolean (default: false)
- `allowPeerContact`: boolean (default: true)

### Security Settings
- `twoFactorEnabled`: boolean (default: false)
- `sessionTimeout`: string (default: '30')

### Dashboard Settings
- `dashboardDefaultView`: 'overview' | 'assignments' | 'evaluations' (default: 'overview')
- `showStats`: boolean (default: true)
- `showRecentActivity`: boolean (default: true)

## Usage Examples

### 1. Using the Hook in Components

```tsx
import { useCookiePreferences } from '../utils/cookiePreferences';

const MyComponent = () => {
  const { preferences, setPreference } = useCookiePreferences();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setPreference('theme', newTheme);
    // Theme is automatically applied to the document
  };

  return (
    <div>
      <p>Current theme: {preferences.theme}</p>
      <button onClick={() => handleThemeChange('dark')}>
        Switch to Dark Mode
      </button>
    </div>
  );
};
```

### 2. Direct Manager Usage

```tsx
import { CookiePreferencesManager } from '../utils/cookiePreferences';

// Get all preferences
const prefs = CookiePreferencesManager.getPreferences();

// Set individual preference  
CookiePreferencesManager.setPreference('theme', 'dark');

// Apply visual preferences immediately
CookiePreferencesManager.applyVisualPreferences();

// Clear all preferences
CookiePreferencesManager.clearPreferences();
```

### 3. Server Synchronization

```tsx
import { CookiePreferencesManager } from '../utils/cookiePreferences';

// In your component that handles server sync
const syncWithServer = async () => {
  try {
    const response = await apiService.get('/preferences/me');
    CookiePreferencesManager.syncWithServerPreferences(response.data);
  } catch (error) {
    console.log('Using local preferences');
  }
};
```

## Floating Cookie Button

The Preferences component renders a floating cookie button positioned in the bottom-right corner of the screen. Features include:

- 🍪 **Cookie-styled icon** - Clear visual indicator
- 📱 **Responsive design** - Works on all screen sizes
- 🎨 **Smooth animations** - Framer Motion powered
- 🔧 **Tabbed interface** - Organized by category
- 💾 **Auto-save** - Changes saved to cookies immediately
- 🔄 **Server sync** - Optional sync button for backend storage

### Positioning

The button is positioned at:
- `bottom: 24px` (6 in Tailwind units)
- `right: 24px` (6 in Tailwind units)
- `z-index: 50` (high priority to stay on top)

### Integration

Simply include the Preferences component in your main App component:

```tsx
import Preferences from './components/Preferences';

function App() {
  return (
    <div>
      {/* Your app content */}
      <Preferences />
    </div>
  );
}
```

## Cookie Configuration

Cookies are configured with:
- **Expiration**: 365 days (1 year)
- **Security**: Secure in production, SameSite=strict
- **Path**: Root path (/)
- **Prefix**: `peereval_` for all preference cookies

## Initialization

Preferences are automatically initialized when the app loads via `App.tsx`:

```tsx
useEffect(() => {
  CookiePreferencesManager.initializePreferences();
}, []);
```

This ensures:
1. Default preferences are set if no cookies exist
2. Theme is applied to the document
3. Language is set on the HTML element

## API Integration

The system is designed to work with a backend preferences API:

### Expected Endpoints:
- `GET /preferences/me` - Get user preferences
- `PATCH /preferences/me` - Update user preferences

### Sample API Integration:

```typescript
// In your preferences component
const loadServerPreferences = async () => {
  try {
    const response = await apiService.get('/preferences/me');
    if (response.data.preferences) {
      const mergedPrefs = { ...localPrefs, ...response.data.preferences };
      CookiePreferencesManager.setPreferences(mergedPrefs);
    }
  } catch (error) {
    console.log('Using cookie preferences (server not available)');
  }
};

const saveToServer = async () => {
  try {
    await apiService.patch('/preferences/me', preferences);
    console.log('Preferences synced to server');
  } catch (error) {
    console.log('Server sync failed, preferences saved locally');
  }
};
```

## Benefits

1. **Immediate Application**: Preferences like theme are applied before any API calls
2. **Offline Support**: Works without internet connection
3. **Performance**: No loading delays for basic preferences
4. **User Experience**: Settings persist across browser sessions
5. **Resilient**: Fallback to defaults if cookies are cleared
6. **Unified**: Single source of truth for UI preferences

## Best Practices

1. **Keep it Light**: Only store preferences that need immediate availability
2. **Default Values**: Always provide sensible defaults
3. **Type Safety**: Use TypeScript interfaces for all preference types
4. **Privacy Compliant**: Only store non-sensitive UI preferences
5. **Regular Cleanup**: Consider cookie expiration and cleanup strategies

## Files Modified/Created

- ✅ `src/utils/cookiePreferences.ts` - Core preference management
- ✅ `src/components/Preferences.tsx` - UI component (completely rewritten)
- ✅ `src/App.tsx` - Added initialization
- ✅ `package.json` - Added js-cookie dependency

## Installation Requirements

```bash
npm install js-cookie @types/js-cookie
```

This system provides a robust, user-friendly way to manage preferences with immediate availability and optional server synchronization.
