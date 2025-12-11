import { Option } from './types';

// Font Token Options (CSS custom properties for semantic fonts)
export const FONT_TOKENS_OPTIONS: Option[] = [
  { label: 'Heading', value: 'var(--font-heading)' },
  { label: 'Body', value: 'var(--font-body)' },
  { label: 'Mono', value: 'var(--font-mono)' },
];

// Color Token Options (CSS custom properties for semantic colors)
export const COLOR_TOKENS_OPTIONS: Option[] = [
  { label: 'On Surface', value: 'var(--color-on-surface)' },
  { label: 'On Surface Secondary', value: 'var(--color-on-surface-secondary)' },
  { label: 'On Surface Tertiary', value: 'var(--color-on-surface-tertiary)' },
  { label: 'Primary', value: 'var(--color-primary)' },
  { label: 'Secondary', value: 'var(--color-secondary)' },
  { label: 'Accent', value: 'var(--color-accent)' },
];

export const COLORS_OPTIONS = [
  { label: 'Black', value: '#000000' },
  { label: 'White', value: '#FFFFFF' },
  { label: 'Gray', value: '#808080' },
  { label: 'Light Gray', value: '#D3D3D3' },
  { label: 'Dark Gray', value: '#A9A9A9' },

  // Reds
  { label: 'Red', value: '#FF0000' },
  { label: 'Pink', value: '#FFC0CB' },
  { label: 'Light Pink', value: '#FFB6C1' },
  { label: 'Dark Pink', value: '#FF1493' },

  // Oranges
  { label: 'Orange', value: '#FFA500' },
  { label: 'Light Orange', value: '#FFDAB9' },
  { label: 'Dark Orange', value: '#FF8C00' },

  // Yellows
  { label: 'Yellow', value: '#FFFF00' },
  { label: 'Light Yellow', value: '#FFFFE0' },
  { label: 'Dark Yellow', value: '#FFD700' },

  // Greens
  { label: 'Green', value: '#00FF00' },
  { label: 'Light Green', value: '#90EE90' },
  { label: 'Dark Green', value: '#006B3C' },

  // Blues
  { label: 'Blue', value: '#0000FF' },
  { label: 'Light Blue', value: '#ADD8E6' },
  { label: 'Dark Blue', value: '#000080' },

  // Purples
  { label: 'Purple', value: '#800080' },
  { label: 'Light Purple', value: '#E6E6FA' },
  { label: 'Dark Purple', value: '#800080' },

  // Browns
  { label: 'Brown', value: '#A52A2A' },
  { label: 'Light Brown', value: '#F5DEB3' },
  { label: 'Dark Brown', value: '#A52A2A' },
];

// Separator Style Options
export const SEPARATOR_STYLE_OPTIONS: Option[] = [
  { label: 'Solid', value: 'solid', isDefault: true },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
  { label: 'Double', value: 'double' },
];

// Default global values
export const DEFAULT_COLOR = COLORS_OPTIONS[0].value;
export const DEFAULT_SEPARATOR_STYLE = SEPARATOR_STYLE_OPTIONS[0].value;
