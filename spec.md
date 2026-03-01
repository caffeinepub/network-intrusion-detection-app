# Specification

## Summary
**Goal:** Convert the NetGuard IDS web app frontend into a mobile-first, app-like experience with bottom tab navigation, single-column layouts, and a mobile splash-style login screen.

**Planned changes:**
- Replace the sticky top navigation bar with a bottom tab bar containing Dashboard, Analysis, History, and Alerts tabs (with an unread badge on Alerts)
- Update all authenticated pages to use single-column, vertically stacked full-width card layouts
- Add a sticky page header with the current page title and a logout/profile icon to each page
- Ensure all touch targets are at least 44px tall and all pages fill the full viewport height without horizontal overflow
- Make the DetectionHistoryTable collapse into a card-per-row layout on small screens
- Redesign the Login page as a mobile splash/onboarding screen with centered logo, app name, tagline, and a prominent full-width Sign In button at the bottom

**User-visible outcome:** The app looks and feels like a native mobile app on small screens (375px+), with bottom tab navigation, stacked card layouts on all pages, and a polished splash-style login screen.
