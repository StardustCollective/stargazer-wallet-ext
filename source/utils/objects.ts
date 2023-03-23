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
}

export const filterObjectByKey = (object: any, filterKey: string) => {
  const newObject: any = {};
  for (const key in object) {
      if (key !== filterKey) {
          newObject[key] = object[key];
      }
  }
  return newObject;
};
