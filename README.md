# QuerystringSerializer

QuerystringSerializer is a TypeScript class that provides serialization and deserialization of objects to and from URL-encoded query strings. It supports handling nested objects and arrays within the serialization and deserialization processes.

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
import { QuerystringSerializer } from 'query-serializer';

const data = {
  name: 'John Doe',
  age: 28,
  address: {
    street: '123 Main St',
    city: 'New York',
    country: 'USA',
  },
};

const queryString = QuerystringSerializer.serialize(data);
console.log(queryString);
// Output: name=John%20Doe&age=28&address.street=123%20Main%20St&address.city=New%20York&address.country=USA
```

### Deserialization

```typescript
import { QuerystringSerializer } from 'query-serializer';

const queryString = 'name=John%20Doe&age=28&address.street=123%20Main%20St&address.city=New%20York&address.country=USA';
const data = QuerystringSerializer.parse(queryString);
console.log(data);
// Output: { name: 'John Doe', age: 28, address: { street: '123 Main St', city: 'New York', country: 'USA' } }
```

### Nested Objects in Arrays

```typescript
import { QuerystringSerializer } from 'query-serializer';

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
console.log(queryString);
// Output: products[0].name=iPhone%2013&products[0].price=999&products[0].features[0]=Face%20ID&products[0].features[1]=A15%20Bionic%20Chip&products[0].features[2]=5G%20Support&products[1].name=Samsung%20Galaxy%20S21&products[1].price=899&products[1].features[0]=Dynamic%20AMOLED%20Display&products[1].features[1]=Snapdragon%20888&products[1].features[2]=108MP%20Camera
```

## Features

- Supports serialization of simple objects into URL-encoded query strings.
- Handles nested objects and arrays within the serialization and deserialization processes.
- Properly encodes query string values using `encodeURIComponent` and decodes them using `decodeURIComponent`.
- Maintains the correct order of array elements during serialization.
- Follows the Google TypeScript Style Guide for code structure and naming conventions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.