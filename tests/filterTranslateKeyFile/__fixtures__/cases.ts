export const case1 = {
  param1: ['key1', 'key2', 'key3'],
  param2: [
    {
      key1: 'key1value1',
      key2: 'key2value1',
      key3: 'key3value1',
      key4: 'key4value1',
    },
    {
      key1: 'key1value2',
      key2: 'key2value2',
      key3: 'key3value2',
      key4: 'key4value2',
    },
    {
      key1: 'key1value3',
      key2: 'key2value3',
      key3: 'key3value3',
      key4: 'key4value3',
    },
  ],
  expectResult: [
    {
      key1: 'key1value1',
      key2: 'key2value1',
      key3: 'key3value1',
    },
    {
      key1: 'key1value2',
      key2: 'key2value2',
      key3: 'key3value2',
    },
    {
      key1: 'key1value3',
      key2: 'key2value3',
      key3: 'key3value3',
    },
  ],
};
