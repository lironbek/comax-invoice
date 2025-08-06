
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
    name: 'קלאסי',
    backgroundColor: '#ffffff',
    innerFrameColor: '#f3f3f3',
    outerFrameColor: '#f8f8f8',
    font: 'Noto Sans Hebrew',
    isSystemPreset: true,
  },
  {
    id: 'modern',
    name: 'מודרני',
    backgroundColor: '#f0f4ff',
    innerFrameColor: '#e0e7ff',
    outerFrameColor: '#c7d2fe',
    font: 'Noto Sans Hebrew',
    isSystemPreset: true,
  },
  {
    id: 'elegant',
    name: 'אלגנטי',
    backgroundColor: '#fafafa',
    innerFrameColor: '#f4f4f5',
    outerFrameColor: '#e4e4e7',
    font: 'Noto Sans Hebrew',
    isSystemPreset: true,
  },
  {
    id: 'warm',
    name: 'חם',
    backgroundColor: '#fefdf8',
    innerFrameColor: '#fef3e2',
    outerFrameColor: '#fed7aa',
    font: 'Noto Sans Hebrew',
    isSystemPreset: true,
  },
];

export const AVAILABLE_FONTS = [
  'Noto Sans Hebrew',
  'Assistant',
  'Rubik',
  'Arial',
  'Inter',
  'Playfair Display',
  'Georgia',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
];
