// Helper functions

export let formatString = (str) => {
    if (typeof(str) != "string") {
        throw new Error(`Input is not a string`);
  }
    // Strings must be trimmed
    str = str.trim()

    // No strings with just empty spaces are valid
    if (str.length == 0) {
      throw new Error(`Input is only spaces`);
    }

    return str;
};