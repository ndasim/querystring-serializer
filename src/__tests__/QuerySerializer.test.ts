// QuerystringSerializer.test.ts
import QuerystringSerializer from '../index';

describe('QuerystringSerializer', () => {
  describe('serialize', () => {
    it('should serialize an object into a query string', () => {
      const obj = {
        name: 'John Doe',
        age: 25,
        hobbies: ['reading', 'swimming'],
        address: {
          city: 'New York',
          country: 'USA',
        },
      };

      const expected =
        'name=John%20Doe&age=25&hobbies[0]=reading&hobbies[1]=swimming&address.city=New%20York&address.country=USA';

      const serialized = QuerystringSerializer.serialize(obj);
      expect(serialized).toEqual(expected);
    });

    it('should return an empty string for an empty object', () => {
      const obj = {};

      const serialized = QuerystringSerializer.serialize(obj);
      expect(serialized).toEqual('');
    });

    // Add more test cases with different objects and expected serialized strings
  });

  describe('parse', () => {
    it('should parse a query string into an object', () => {
      const queryString =
        'name=John%20Doe&age=25&hobbies[0]=reading&hobbies[1]=swimming&address.city=New%20York&address.country=USA';

      const expected = {
        name: 'John Doe',
        age: 25,
        hobbies: ['reading', 'swimming'],
        address: {
          city: 'New York',
          country: 'USA',
        },
      };

      const parsed = QuerystringSerializer.parse(queryString);
      expect(parsed).toEqual(expected);
    });

    it('should return an empty object for an empty query string', () => {
      const queryString = '';

      const parsed = QuerystringSerializer.parse(queryString);
      expect(parsed).toEqual({});
    });

    // Add more test cases with different query strings and expected parsed objects
  });

  test('parse complex nested objects', () => {
    const input = {
      a: 'b',
      c: [
        { d: 'e' },
        {
          f: [
            {
              g: 'h',
              i: ['j', 'k', 'l'],
            },
          ],
        },
      ],
    };

    const serialized = QuerystringSerializer.serialize(input);

    const output = QuerystringSerializer.parse(serialized);
    expect(output).toEqual(input);
  });

  test('parse complex nested objects with url safe encoding parameters', () => {
    const input = {
      a: 'b',
      c: [
        { d: 'e' },
        {
          f: [
            {
              g: 'h',
              i: ['j', 'k', 'l'],
            },
          ],
        },
      ],
    };

    const serialized = QuerystringSerializer.serialize(input, {
      ...QuerystringSerializer.defaultParameters,
      arrayStart: ':',
      arrayEnd: ':',
    });

    console.log(serialized);

    const output = QuerystringSerializer.parse(serialized, {
      ...QuerystringSerializer.defaultParameters,
      arrayStart: ':',
      arrayEnd: ':',
    });

    expect(output).toEqual(input);
  });

  it('should make some fun', function () {
    const funParameters = {
      ...QuerystringSerializer.defaultParameters,
      nestDelimiter: ' make ',
      equalityChar: ' some ',
    };

    const wut = {
      should: { make: 'fun' },
    };

    let serialized = QuerystringSerializer.serialize(wut, funParameters);

    let marooned = QuerystringSerializer.parse(serialized, funParameters);

    let t = QuerystringSerializer.serialize(
      {
        simple: 'value',
        array: [
          {
            internal: ['val1', 'val2'],
          },
        ],
      },
      {
        ...QuerystringSerializer.defaultParameters,
        arrayStart: '@',
        arrayEnd: '',
        equalityChar: ':',
        delimiter: '#',
      },
    );

    console.log(t);

    expect(wut).toEqual(marooned);
  });
});
