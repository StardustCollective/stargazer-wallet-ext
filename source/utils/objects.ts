import * as crypto from 'crypto';

export const splitObjectByKey = (object: any, splitKey: string) => {
  const firstPart: any = {};
  const secondPart: any = {};
  let keyFound = false;

  for (const key in object) {
    if (key === splitKey) {
      firstPart[key] = object[key];
      break;
    }
    firstPart[key] = object[key];
  }

  for (const key in object) {
    if (key !== splitKey) {
      if (keyFound) {
        secondPart[key] = object[key];
      }
    } else {
      keyFound = true;
    }
  }

  return [firstPart, secondPart];
};

export const filterArrayByValue = (array: any, key: string, value: any) => {
  return array.filter((item: any) => item[key] !== value);
};

export const filterObjectByKey = (object: any, filterKey: string) => {
  const newObject: any = {};
  for (const key in object) {
    if (key !== filterKey) {
      newObject[key] = object[key];
    }
  }
  return newObject;
};

export const getParamsFromObject = (object: any): string => {
  const params = new URLSearchParams();

  // Iterate over the object's properties
  for (const [key, value] of Object.entries(object)) {
    if (['string', 'number'].includes(typeof value)) {
      params.append(key, value as string);
    }
  }

  return params.toString();
};

const hashString = (input: string): string => {
  return crypto.createHash('sha256').update(input).digest('hex');
};

const canonicalize = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(canonicalize);
  }

  return Object.keys(obj)
    .sort()
    .reduce((result: any, key: string) => {
      result[key] = canonicalize(obj[key]);
      return result;
    }, {});
};

export const compareObjects = (obj1: object, obj2: object): boolean => {
  const str1 = JSON.stringify(canonicalize(obj1));
  const str2 = JSON.stringify(canonicalize(obj2));

  const hash1 = hashString(str1);
  const hash2 = hashString(str2);

  return hash1 === hash2;
};
