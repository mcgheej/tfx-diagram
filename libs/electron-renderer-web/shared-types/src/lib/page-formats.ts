export const pageFormats = ['A4', 'A0', 'A1', 'A2', 'A3', 'A5', 'Custom'] as const;
export const pageSizesMM: { [key: string]: { width: number; height: number } } = {
  ['A4']: {
    width: 210,
    height: 297,
  },
  ['A0']: {
    width: 841,
    height: 1188,
  },
  ['A1']: {
    width: 594,
    height: 841,
  },
  ['A2']: {
    width: 420,
    height: 594,
  },
  ['A3']: {
    width: 297,
    height: 420,
  },
  ['A5']: {
    width: 148,
    height: 210,
  },
  ['Custom']: {
    width: 210,
    height: 297,
  },
};
