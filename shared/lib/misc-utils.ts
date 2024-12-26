export function generateRandomID(length: number, prefix: string | null) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return prefix ? `${prefix.replace(/ /g, '-')}-${result}` : result;
}

/**
 * Divide an array into smaller chunk of arrays
 * @param {array} arr
 * @param {number} size How many elements in each chunk of array
 * @return {array}
 */
export function arrayChunks(arr: any[], size: number) {
  return arr.reduce((acc, val, i) => {
    const idx = Math.floor(i / size);
    const page = acc[idx] || (acc[idx] = []);
    page.push(val);

    return acc;
  }, []);
}

/**
 * Create chunks of a string. Each chunk does not exceed a certain length and only splits at the delimiter.
 * NOTE: It is assumed that no single value will exceed the given maxLength.
 *
 * chunkDelimitedString('Lorem ipsum dolor sit amet consectetur adipisicing elit', 20)
 *  => [ 'Lorem ipsum dolor', 'sit amet consectetur', ' adipisicing elit' ]
 *
 * chunkDelimitedString([123,456,789,1234,5678,9012,3456,7890], 15, ',')
 *  => [ '123,456,789', '1234,5678,9012', '3456,7890' ]
 */
export const chunkDelimitedString = (value: Array<any> | string, maxLength: number, delimiter = ' ') => {
  const arrayValue = Array.isArray(value) ? value : value.split(delimiter);

  const chunks = [];
  let thisChunk = String(arrayValue[0]);

  for (let i = 1; i < arrayValue.length; i += 1) {
    const nextValue = String(arrayValue[i]);

    if (thisChunk.length + nextValue.length + 1 <= maxLength) {
      thisChunk = `${thisChunk}${delimiter}${nextValue}`;
    } else {
      chunks.push(thisChunk);
      thisChunk = nextValue;
    }
  }

  if (thisChunk.length) {
    chunks.push(thisChunk);
  }

  return chunks;
};

export function deepEquals(obj1: any, obj2: any): any {
  // Check if the objects are of the same type
  if (typeof obj1 !== typeof obj2) {
    return false;
  }

  // Check if the objects are null
  if (obj1 === null || obj2 === null) {
    return obj1 === obj2;
  }

  // Check if the objects are arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    // Check if the arrays have the same length
    if (obj1.length !== obj2.length) {
      return false;
    }

    // Check each element of the arrays recursively
    return obj1.every((element, index) => deepEquals(element, obj2[index]));
  }

  // compare dates
  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.toISOString() === obj2.toISOString();
  }

  // Check if the objects are objects (excluding arrays and null)
  if (typeof obj1 === 'object' && typeof obj2 === 'object') {
    // Get the keys of the objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Check if the objects have the same number of keys
    if (keys1.length !== keys2.length) {
      return false;
    }

    // Check each key-value pair recursively
    return keys1.every((key) => deepEquals(obj1[key], obj2[key]));
  }

  // Check primitive values using strict equality
  return obj1 === obj2;
}

export function sortArray(data: Array<any>, property: string, sortOrder = 1) {
  if (sortOrder === 1) {
    return data.sort((a, b) => a[property].localeCompare(b[property]));
  }
  return data.sort((a, b) => b[property].localeCompare(a[property]));
}

const promises = new Map<string, Promise<any>>();

/**
 * For the given promise key, resolve the last promise provided with actual payload data.
 * Otherwise, older promises resolve with null data.
 *
 * @param promiseKey string - An id string for the promise.
 * @param currentPromise Promise<any> - The latest promise for the given key.
 * @returns Promise<any> - The given promise. Resolves with null payload if it is not the latest promise.
 */
export const getRecentPromise = async (promiseKey: string, currentPromise: Promise<any>): Promise<any> => {
  promises.set(promiseKey, currentPromise);

  const response = await currentPromise;

  return promises.get(promiseKey) === currentPromise ? response : null;
};

/**
 * Escape HTML characters in a string.
 * @param unsafe
 */
export function escapeHtml(unsafe: string): string {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(unsafe));
  return div.innerHTML;
}

/**
 * Check if a variable is an integer optionally within a given range.
 */
export const isValidInteger = (value: any, minValue?: number, maxValue?: number) => {
  let isValid = /^-?\d+/.test(value);

  if (minValue !== undefined) {
    isValid = isValid && value >= minValue;
  }

  if (maxValue !== undefined) {
    isValid = isValid && value <= maxValue;
  }

  return isValid;
};

export const DATE_FORMAT = {
  SYSTEM: 'yyyy-MM-dd',
  SYSTEM_SHORT: 'yyyy-MM',
};

export default {
  generateRandomID,
  arrayChunks,
  deepEquals,
  escapeHtml,
  sortArray,
};

/**
 * Pick properties from an object; helpful for creating new objects with a subset of properties from another object.
 *
 * Example: formData.value.courseDetails = pick(data, ['name', 'short_name', 'summary', 'course_id']);
 */
export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  if (obj === null || obj === undefined) {
    return {} as Pick<T, K>;
  }

  return keys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Pick<T, K>);
}

/**
 * Check if a string is a valid URL.
 * @param url
 */
export function isValidURL(url: string) {
  const pattern = /^https?:\/\//;
  try {
    if (!pattern.test(url)) return false;
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Convert an image URL to a File object.
 * @param imageSrc
 */
export async function convertImagePathToFile(imageSrc: string) {
  const res = await fetch(imageSrc);
  const blob = await res.blob();

  // If the blob is already a File instance, return it.
  if (blob instanceof File) {
    return blob;
  }

  const filename = imageSrc.split('/').pop() || '';
  const contentType = res.headers.get('content-type') || '';

  return new File([blob], filename, { type: contentType });
}

/**
 * Sleep for a given number of seconds.
 * @param seconds
 */
export function sleep(seconds: number) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function objectArrayHasDuplicates(array:object[], property:string) {
  const seenValues = new Set();

  return array.some((item) => {
    if (seenValues.has(item[property])) {
      return true;
    }
    seenValues.add(item[property]);
    return false;
  });
}
