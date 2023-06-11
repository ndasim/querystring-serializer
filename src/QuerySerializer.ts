/**
 * QuerySerializer is a class that performs serialization and deserialization of objects to and from URL-encoded query strings.
 */
class QuerySerializer {
    /**
     * Converts the given object into a URL-encoded query string.
     * @param data - The object to be serialized
     * @returns The query string representation of the object
     */
    public static serialize(data: Record<string, any>): string {
        const queryStringParams: string[] = [];
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const value = data[key];
                const serializedValue = QuerySerializer.serializeValue(key, value);
                queryStringParams.push(serializedValue);
            }
        }
        return queryStringParams.join('&');
    }

    /**
     * Converts the given value into a URL-encoded query string representation.
     * @param key - The key of the value
     * @param value - The value to be serialized
     * @returns The URL-encoded query string representation of the value
     */
    private static serializeValue(key: string, value: any): string {
        if (Array.isArray(value)) {
            return QuerySerializer.serializeArray(key, value);
        } else if (typeof value === 'object') {
            return QuerySerializer.serializeObject(key, value);
        } else {
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
    }

    /**
     * Converts the given array into a URL-encoded query string representation.
     * @param key - The key of the array
     * @param array - The array to be serialized
     * @returns The URL-encoded query string representation of the array
     */
    private static serializeArray(key: string, array: any[]): string {
        const serializedValues: string[] = [];
        for (let i = 0; i < array.length; i++) {
            const serializedValue = QuerySerializer.serializeValue(`${key}[${i}]`, array[i]);
            serializedValues.push(serializedValue);
        }
        return serializedValues.join('&');
    }

    /**
     * Converts the given object into a URL-encoded query string representation.
     * @param key - The key of the object
     * @param object - The object to be serialized
     * @returns The URL-encoded query string representation of the object
     */
    private static serializeObject(key: string, object: Record<string, any>): string {
        const serializedValues: string[] = [];
        for (const objectKey in object) {
            if (Object.prototype.hasOwnProperty.call(object, objectKey)) {
                const serializedValue = QuerySerializer.serializeValue(`${key}.${objectKey}`, object[objectKey]);
                serializedValues.push(serializedValue);
            }
        }
        return serializedValues.join('&');
    }

    /**
     * Parses the given URL-encoded query string and converts it into an object.
     * @param queryString - The URL-encoded query string
     * @returns The object representation of the query string
     */
    public static parse(queryString: string): Record<string, any> {
        const data: Record<string, any> = {};
        const params = queryString.split('&');
        for (const param of params) {
            const [key, value] = param.split('=');
            if (key && value) {
                const decodedKey = decodeURIComponent(key);
                const decodedValue = decodeURIComponent(value);
                QuerySerializer.parseParam(data, decodedKey, decodedValue);
            }
        }
        return data;
    }

    /**
     * Parses the given parameter and assigns it to the data object.
     * @param data - The data object to assign the parameter to
     * @param key - The key of the parameter
     * @param value - The value of the parameter
     */
    private static parseParam(data: Record<string, any>, key: string, value: string): void {
        const keys = key.split('.');
        let currentObject = data;
        for (let i = 0; i < keys.length; i++) {
            const currentKey = keys[i];
            if (i === keys.length - 1) {
                // Last key in the chain
                currentObject[currentKey] = QuerySerializer.parseValue(value);
            } else {
                // Intermediate key in the chain
                if (!currentObject[currentKey]) {
                    currentObject[currentKey] = {};
                }
                currentObject = currentObject[currentKey];
            }
        }
    }

    /**
     * Parses the given value and converts it to the appropriate data type.
     * @param value - The value to be parsed
     * @returns The parsed value
     */
    private static parseValue(value: string): any {
        if (isNaN(Number(value))) {
            return value;
        } else {
            return Number(value);
        }
    }
}