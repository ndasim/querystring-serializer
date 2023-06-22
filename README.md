# QuerystringSerializer

QuerystringSerializer is a TypeScript class that provides serialization and deserialization of objects to and from URL-encoded query strings. It supports handling nested objects and arrays within the serialization and deserialization processes.

It's inspired by popular package qs (https://www.npmjs.com/package/qs)

## Features

* Supports serialization of simple objects into URL-encoded query strings.
* Handles nested objects and arrays within the serialization and deserialization processes.
* Properly encodes query string values using encodeURIComponent and decodes them using decodeURIComponent.
* Allows developers to serialize objects as human-readable for search queries.
* Provides flexible serialization parameters for more unusual scenarios.
* Maintains the correct order of array elements during serialization.
* Follows the Google TypeScript Style Guide for code structure and naming conventions.


## Installation

You can install the `QuerystringSerializer` package using either npm or yarn.

### npm

```shell
npm install querystring-serializer
```

### yarn

```shell
yarn add querystring-serializer
```

## Usage

### Serialization

```typescript
import QuerystringSerializer from "querystring-serializer";

const data = {
    a: 'b', 
    c: {
      d: 1, 
      e: true
    },
};

const queryString = QuerystringSerializer.serialize(data);
```
``queryString`` will be:
```
a=b&c.d=1&c.e=true'
```

### Deserialization

```typescript
import QuerystringSerializer from "querystring-serializer";

const queryString = 'a=b&c.d=1&c.e=true';
const data = QuerystringSerializer.parse(queryString);
```
``data`` will be:
```json
{
    a: 'b', 
    c: {
      d: 1, 
      e: true
    },
};
```

### Nested Objects in Arrays

```typescript
import QuerystringSerializer from "querystring-serializer";

const data = {
    a: 'b', 
    c: [
        {
            f: ["g", "h"]
        },
    ]
};

const queryString = QuerystringSerializer.serialize(data);
```
``queryString`` will be:
```
a=b&c[0].f[0]=g&c[0].f[1]=h
```

Same way, ``QuerystringSerializer.serialize("a=b&c[0].f[0]=g&c[0].f[1]=h'");`` will produce:
```json
{
    a: 'b', 
    c: [
        {
            f: ["g", "h"]
        },
    ]
}
```

### Encoded Results
```typescript
import QuerystringSerializer from "querystring-serializer";

const data = {
  products: [
    {
      name: 'iPhone 13',
      price: 999,
      features: ['Face ID', 'A15 Bionic Chip', '5G Support'],
    },
    {
      name: 'Samsung Galaxy S21',
      price: 899,
      features: ['Dynamic AMOLED Display', 'Snapdragon 888', '108MP Camera'],
    },
  ],
};

const queryString = QuerystringSerializer.serialize(data);
```
``queryString`` will be:
```
products[0].name=iPhone%2013&products[0].price=999&products[0].features[0]=Face%20ID&products[0].features[1]=A15%20Bionic%20Chip&products[0].features[2]=5G%20Support&products[1].name=Samsung%20Galaxy%20S21&products[1].price=899&products[1].features[0]=Dynamic%20AMOLED%20Display&products[1].features[1]=Snapdragon%20888&products[1].features[2]=108MP%20Camera
```

### URL Friendly, Human readible serialization
The main motivation behind that package was to make URL search parameters more human-readable.
However, the default results of the serialize function produce special characters like "[" and "]",
which transform the following ``beautiful[0]=querystring`` into ``beautiful%5B0%5D%3Dquerystring``, making it hard to read.

After version 0.1.0, I have changed fixed characters(like [,],=,.) from serialization and make them parametric:
* ``delimiter`` - The delimiter used to separate key-value pairs in the query string. (Default: '&')
* ``arrayStart`` - The string that indicates the start of an array in the object. (Default: '[')
* ``arrayEnd`` - The string that indicates the end of an array in the object. (Default: ']')
* ``equalityChar`` - The character used to assign values to keys in the query string. (Default: '=')
* ``nestDelimiter`` - The delimiter used to represent nested objects in the query string. (Default: '.')

So, you will be able to modify your results like that:
```typescript
import QuerystringSerializer from "querystring-serializer";

const data = {
    beatiful: ['querystring'],
};

const queryString = QuerystringSerializer.serialize(
    data, 
    {
        ...QuerystringSerializer.defaultParameters,
        arrayStart: "#",
        arrayEnd: ""
    }
);
```
``queryString`` will be:
```
beatiful#0=querystring
```

To parse that string you need to follow same method in parse function

```typescript
import QuerystringSerializer from "querystring-serializer";

const queryString = 'beautiful#0=querystring';
const data = QuerystringSerializer.parse(
    queryString,
    {
        ...QuerystringSerializer.defaultParameters,
        arrayStart: "#",
        arrayEnd: ""
    }
);
```
``data`` will be:
```json
{
  beautiful: ['querystring'],
};
```

If you want to use result for querystring parameter values, which is very common developer attitude:
```typescript
import QuerystringSerializer from "querystring-serializer";

const data = {
    my: ['data', "parameter"],
};

const queryString = QuerystringSerializer.serialize(
    {
        simple: 'value',
        array: [
            {
                internal: ["val1", "val2"]
            },
        ]
    },
    {
        ...QuerystringSerializer.defaultParameters,
        arrayStart: "@",
        arrayEnd: "",
        equalityChar: ":",
        delimiter: "#"
    }
);
```
``queryString`` will be:
```
simple:value#array@0.internal@0:val1#array@0.internal@1:val2
```

###
#### Fun part of it
For those parameters you can use keywords too.
To explain this more clearly, lets check our last test on the ``src/__test__/QuerySerializer.test.ts``which will make your day 
```typescript
import QuerystringSerializer from "querystring-serializer";

const funParameters = {...QuerystringSerializer.defaultParameters,
    nestDelimiter: " make ",
    equalityChar: " some "
}

const wut = {
    should: {make: "fun"},
}

const serialized = QuerystringSerializer.serialize(
    wut,
    funParameters
)

const marooned = QuerystringSerializer.parse(serialized, funParameters)

expect(wut).toEqual(marooned);
```
guess ``serialized`` what can be:
```
should make some fun
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.