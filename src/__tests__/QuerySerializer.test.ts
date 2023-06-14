// QuerySerializer.test.ts
import QuerySerializer from '../index';

describe('QuerySerializer', () => {
  test('nested', () => {
    const input = {
      markalar: [
        {
          name: 'Renault',
          modeller: [
            {
              name: 'Captur',
              year: 2013,
              awards: [1, 2, 3],
            },
            {
              name: 'Clio',
              year: 2015,
              awards: [4, 5, 6],
            },
          ],
          price: 3000,
        },
        {
          name: 'Fiat',
          modeller: [
            {
              name: 'Egea',
              year: 2020,
              awards: [10],
            },
          ],
          price: 6000,
        },
      ],
      totalPrice: 9000,
    };

    const output = QuerySerializer.serialize(input);
    expect(output).toBe(
      'markalar[0].name=Renault&markalar[0].modeller[0].name=Captur&markalar[0].modeller[0].year=2013&markalar[0].modeller[0].awards[0]=1&markalar[0].modeller[0].awards[1]=2&markalar[0].modeller[0].awards[2]=3&markalar[0].modeller[1].name=Clio&markalar[0].modeller[1].year=2015&markalar[0].modeller[1].awards[0]=4&markalar[0].modeller[1].awards[1]=5&markalar[0].modeller[1].awards[2]=6&markalar[0].price=3000&markalar[1].name=Fiat&markalar[1].modeller[0].name=Egea&markalar[1].modeller[0].year=2020&markalar[1].modeller[0].awards[0]=10&markalar[1].price=6000&totalPrice=9000',
    );
  });

  test('nested with empty object', () => {
    const input = {};

    const output = QuerySerializer.serialize(input);
    expect(output).toBe('');
  });

  test('parse with empty query string', () => {
    const input = '';

    const output = QuerySerializer.parse(input);
    expect(output).toEqual({});
  });

  test('nested with special characters', () => {
    const input = {
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'P@$$w0rd!',
      },
    };

    const output = QuerySerializer.serialize(input);
    expect(output).toBe('user.name=John%20Doe&user.email=john.doe%40example.com&user.password=P%40%24%24w0rd!');
  });

  test('parse with special characters', () => {
    const input = 'user.name=John%20Doe&user.email=john.doe%40example.com&user.password=P%40%24%24w0rd%21';

    const output = QuerySerializer.parse(input);
    expect(output).toEqual({
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'P@$$w0rd!',
      },
    });
  });

  test('parse nested objects', () => {
    const input = 'user.name=John%20Doe&user.email=john.doe%40example.com&user.password=P%40%24%24w0rd%21';

    const output = QuerySerializer.parse(input);
    expect(output).toEqual({
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'P@$$w0rd!',
      },
    });
  });
});
