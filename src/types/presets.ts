
export interface DesignPreset {
  id: string;
  name: string;
  backgroundColor: string;
  innerFrameColor: string;
  outerFrameColor: string;
  font: string;
  isSystemPreset: boolean;
}

export const SYSTEM_PRESETS: DesignPreset[] = [
  {
    id: 'classic',
    name: 'Classic White',
    backgroundColor: '#ffffff',
    innerFrameColor: '#f3f3f3',
    outerFrameColor: '#f8f8f8',
    font: 'Arial',
    isSystemPreset: true,
  },
  {
    id: 'modern',
    name: 'Modern Blue',
    backgroundColor: '#f8fafc',
    innerFrameColor: '#e2e8f0',
    outerFrameColor: '#cbd5e1',
    font: 'Inter',
    isSystemPreset: true,
  },
  {
    id: 'elegant',
    name: 'Elegant Gray',
    backgroundColor: '#fafafa',
    innerFrameColor: '#e5e5e5',
    outerFrameColor: '#d4d4d4',
    font: 'Playfair Display',
    isSystemPreset: true,
  },
  {
    id: 'warm',
    name: 'Warm Cream',
    backgroundColor: '#fefdf8',
    innerFrameColor: '#fef3e2',
    outerFrameColor: '#fed7aa',
    font: 'Georgia',
    isSystemPreset: true,
  },
];

export const AVAILABLE_FONTS = [
  'Arial',
  'Inter',
  'Playfair Display',
  'Georgia',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
];
