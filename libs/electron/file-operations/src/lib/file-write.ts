/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs';

export const fileWrite = (path: string, data: string, base64 = false): void => {
  try {
    if (base64) {
      fs.writeFileSync(path, data, 'base64');
    } else {
      fs.writeFileSync(path, data);
    }
  } catch (err: any) {
    throw Error(err);
  }
};
