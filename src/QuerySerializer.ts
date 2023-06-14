/**
 * QuerySerializer class provides methods to serialize and deserialize
 * objects into URL-encoded query strings, following the rules specified.
 */
/**
 * QuerySerializer class provides methods to serialize and parse nested objects
 * into query strings and vice versa.
 */
class QuerySerializer {
  /**
   * Serializes a nested object into a query string.
   * @param obj - The object to be serialized.
   * @returns The serialized query string.
   */
  static nested(obj: any): string {
    const result: string[] = [];

    // Return empty string if the object is empty or not an object
    if(Object.keys(obj).length == 0) return ""
    if(obj.constructor != ({}).constructor) return ""

    /**
     * Traverses the object recursively and constructs the query string.
     * @param obj - The object to be traversed.
     * @param prefix - The current prefix for the key in the query string.
     */
    const traverse = (obj: any, prefix: string = '') => {
      for (const key in obj) {
        if (Array.isArray(obj[key])) {
          obj[key].forEach((value: any, index: number) => {
            if (typeof value === 'object') {
              traverse(value, `${prefix}${key}[${index}].`);
            } else {
              result.push(`${prefix}${key}[${index}]=${encodeURIComponent(value)}`);
            }
          });
        } else if (typeof obj[key] === 'object') {
          traverse(obj[key], `${prefix}${key}.`);
        } else {
          result.push(`${prefix}${key}=${encodeURIComponent(obj[key])}`);
        }
      }
    };

    traverse(obj);
    return result.join('&');
  }

  /**
   * Parses a query string into a nested object.
   * @param str - The query string to be parsed.
   * @returns The parsed object.
   */
  static parse(str: string): any {
    const obj: any = {};

    if(str == "") return {}

    /**
     * Decodes a key by replacing array indices with dots.
     * @param key - The key to be decoded.
     * @returns The decoded key.
     */
    const decodeKey = (key: string): string => {
      return key.replace(/\[(\d+)\]/g, '.$1');
    };

    /**
     * Sets a value in the object based on the key.
     * @param key - The key to set the value for.
     * @param value - The value to be set.
     * @param obj - The object to set the value in.
     */
    const setValue = (key: string, value: any, obj: any) => {
      const keys = key.split('.');
      let currentObj = obj;

      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];

        if (i === keys.length - 1) {
          currentObj[k] = value;
        } else {
          if (!currentObj[k]) {
            if (isNaN(Number(keys[i + 1]))) {
              currentObj[k] = {};
            } else {
              currentObj[k] = [];
            }
          }

          currentObj = currentObj[k];
        }
      }
    };

    const pairs = str.split('&');

    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      const decodedKey = decodeKey(decodeURIComponent(key));
      const decodedValue = decodeURIComponent(value);

      const val =
          decodedValue === 'true'
              ? true
              : decodedValue === 'false'
                  ? false
                  : /^\d+$/.test(decodedValue)
                      ? parseInt(decodedValue, 10)
                      : decodedValue;

      setValue(decodedKey, val, obj);
    }

    return obj;
  }
}


export default QuerySerializer;