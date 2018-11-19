import {
  DEFAULT_TIME_INTERVAL,
  toArray,
  isContainArray,
  isCodeEqual,
} from './utils';

test('DEFAULT_TIME_INTERVAL equal to 30 minute(1800000 millisecond)', () => {
  const received = DEFAULT_TIME_INTERVAL;
  const expected = 1800000;
  expect(received).toBe(expected);
});

test('toArray 將string轉成array,若為array則不處理', () => {
  const string = 'string 1';
  const received = [string];
  const expected = received;

  expect(toArray(string)).toEqual(expect.arrayContaining(received));
  expect(toArray(received)).toEqual(expect.arrayContaining(expected));
});

test('isContainArray 判斷array是否含有資料,回傳true/false', () => {
  const number = 123;
  const string = 'foo';
  const emptyObject = {};
  const emptyArray = [];
  const received = ['string 1'];

  expect(isContainArray(number)).toBeFalsy();
  expect(isContainArray(string)).toBeFalsy();
  expect(isContainArray(emptyObject)).toBeFalsy();
  expect(isContainArray(emptyArray)).toBeFalsy();
  expect(isContainArray(received)).toBeTruthy();
});

test('isCodeEqual 判斷兩值相等', () => {
  const receivedOne = 'foo';
  const receivedTwo = 123;
  const receivedThree = 'foo';

  expect(isCodeEqual(receivedTwo, receivedThree)).toBeFalsy();
  expect(isCodeEqual(receivedOne, receivedThree)).toBeTruthy();
});
