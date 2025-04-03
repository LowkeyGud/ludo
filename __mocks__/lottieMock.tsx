module.exports = {
  process(src, filename) {
    // Instead of parsing the JSON normally, just return the mocked value.
    return {
      code: `module.exports = "mocked-json";`,
    };
  },
};
