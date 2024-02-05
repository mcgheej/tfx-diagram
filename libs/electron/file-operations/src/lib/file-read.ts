/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs';

export const fileRead = (path: string): string => {
  try {
    return fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
  } catch (err: any) {
    throw Error(err);
  }
};
