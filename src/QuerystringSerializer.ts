interface NamedParameters{
  delimiter: string,
  arrayStart: string,
  arrayEnd: string,
  equalityChar: string,
  nestDelimiter: string
}

/**
 * QuerystringSerializer class provides methods to serialize and parse nested objects
 * into query strings and vice versa.
 */
class QuerystringSerializer {
  static readonly defaultParameters = {
    delimiter: '&',
    arrayStart: '[',
    arrayEnd: ']',
    equalityChar: '=',
    nestDelimiter: '.'
  }

  /**
   * Serializes an object into a query string.
   * @param obj - The object to serialize.
   * @param delimiter - The delimiter used to separate key-value pairs in the query string. (Default: '&')
   * @param arrayStart - The string that indicates the start of an array in the object. (Default: '[')
   * @param arrayEnd - The string that indicates the end of an array in the object. (Default: ']')
   * @param equalityChar - The character used to assign values to keys in the query string. (Default: '=')
   * @param nestDelimiter - The delimiter used to represent nested objects in the query string. (Default: '.')
   * @returns The serialized query string.
   */
  static serialize(
      obj: any,
      {
        delimiter,
        arrayStart,
        arrayEnd,
        equalityChar,
        nestDelimiter
      } : NamedParameters = QuerystringSerializer.defaultParameters
  ): string {
    const result: string[] = [];

    // Return empty string if the object is empty or not an object
    if (Object.keys(obj).length === 0) return '';
    if (obj.constructor !== {}.constructor) return '';

    const traverse = (object: any, prefix: string = '') => {
      for (const key in object) {
        if (Array.isArray(object[key])) {
          object[key].forEach((value: any, index: number) => {
            if (typeof value === 'object') {
              traverse(value, `${prefix}${key}${arrayStart}${index}${arrayEnd}${nestDelimiter}`);
            } else {
              result.push(`${prefix}${key}${arrayStart}${index}${arrayEnd}${equalityChar}${encodeURIComponent(value)}`);
            }
          });
        } else if (typeof object[key] === 'object') {
          traverse(object[key], `${prefix}${key}${nestDelimiter}`);
        } else {
          result.push(`${prefix}${key}${equalityChar}${encodeURIComponent(object[key])}`);
        }
      }
    };

    traverse(obj);
    return result.join(delimiter);
  }

  /**
   * Parses a query string into an object.
   * @param str - The query string to parse.
   * @param delimiter - The delimiter used to separate key-value pairs in the query string. (Default: '&')
   * @param arrayStart - The string that indicates the start of an array in the object. (Default: '[')
   * @param arrayEnd - The string that indicates the end of an array in the object. (Default: ']')
   * @param equalityChar - The character used to assign values to keys in the query string. (Default: '=')
   * @param nestDelimiter - The delimiter used to represent nested objects in the query string. (Default: '.')
   * @returns The parsed object.
   */
  static parse(
      str: string,
      {
        delimiter,
        arrayStart,
        arrayEnd,
        equalityChar,
        nestDelimiter
      } : NamedParameters = QuerystringSerializer.defaultParameters
  ): any {
    const obj: any = {};

    if (str === '') return {};

    const decodeKey = (key: string): string => {
      // Helper function to escape regex special characters
      const escapeRegExp = (string: string) => {
        return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
      };

      const escapedArrayStart = escapeRegExp(arrayStart);
      const escapedArrayEnd = escapeRegExp(arrayEnd);

      const regexPattern = new RegExp(`${escapedArrayStart}(\\d+)${escapedArrayEnd}`, 'g');

      return key.replace(regexPattern, `${nestDelimiter}$1`);
    };

    const setValue = (key: string, value: any, object: any) => {
      const keys = key.split(nestDelimiter);
      let currentObj = object;

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

    const pairs = str.split(delimiter);

    for (const pair of pairs) {
      const [key, value] = pair.split(equalityChar);
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

export default QuerystringSerializer;
