// Silence the deliberate error logging from the SDK's catch blocks. The
// negative-path tests exercise these branches on purpose, so the logs are
// expected noise rather than failures.
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});
