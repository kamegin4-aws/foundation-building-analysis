export const LOGO_SRC = `/app.png`;

export const SETTINGS_ITEMS = [
  {
    id: 'settings-org',
    text: 'Organizational settings',
  },
  {
    id: 'settings-project',
    text: 'Project settings',
  },
];

export const USER_PROFILE_ITEMS = [
  { id: 'profile', text: 'Profile' },
  { id: 'preferences', text: 'Preferences' },
  { id: 'security', text: 'Security' },
  {
    id: 'support-group',
    text: 'Support',
    items: [
      {
        id: 'documentation',
        text: 'Documentation',
        href: '#',
        external: true,
        externalIconAriaLabel: ' (opens in new tab)',
      },
      { id: 'support', text: 'Support' },
      {
        id: 'feedback',
        text: 'Feedback',
        href: '#',
        external: true,
        externalIconAriaLabel: ' (opens in new tab)',
      },
    ],
  },
  { id: 'signOut', text: 'Sign out' },
];
