export const mockPlug = jest.fn();

const mock = jest.fn().mockImplementation(() => {
  return {
    getState: 2,
  };
});
