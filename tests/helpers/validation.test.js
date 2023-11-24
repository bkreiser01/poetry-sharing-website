import { deserialize } from "mongodb";
import validation from "../../helpers/validation.js";

describe("checkId", () => {
  test("no_args", () => {
    expect(() => {
      validation.checkId();
    }).toThrow();
  });

  test("id_is_undefined", () => {
    expect(() => {
      validation.checkId(undefined, "id");
    }).toThrow("Error: You must provide a id");
  });

  test("id_not_a_string", () => {
    expect(() => validation.checkId(1, "id")).toThrow(
      "Error: id must be a string"
    );
  });

  test("id_empty_string", () => {
    expect(() => {
      validation.checkId("", "id");
    }).toThrow();
  });

  test("id_just_spaces", () => {
    expect(() => {
      validation.checkId("     ", "id");
    }).toThrow("Error: id cannot be an empty string or just spaces");
  });

  test("id_not_an_ObjectId", () => {
    expect(() => {
      validation.checkId("test", "id");
    }).toThrow("Error: id invalid ObjectId");
  });

  test("valid_ObjectId", () => {
    expect(validation.checkId("000000000000000000000000", "id")).toEqual(
      "000000000000000000000000"
    );
  });

  test("valid_ObjectId_trimmed", () => {
    expect(
      validation.checkId("        000000000000000000000000         ", "id")
    ).toEqual("000000000000000000000000");
  });
});

describe("checkString", () => {
  test("no_args", () => {
    expect(() => {
      validation.checkString();
    }).toThrow();
  });

  test("strVal_is_undefined", () => {
    expect(() => {
      validation.checkString(undefined, "string_arg");
    }).toThrow("Error: You must supply a string_arg");
  });

  test("strVal_not_a_string", () => {
    expect(() => validation.checkString(1, "string_arg")).toThrow(
      "Error: string_arg must be a string"
    );
  });

  test("strVal_empty_string", () => {
    expect(() => {
      validation.checkString("", "string_arg");
    }).toThrow();
  });

  test("strVal_just_spaces", () => {
    expect(() => {
      validation.checkString("     ", "string_arg");
    }).toThrow(
      "Error: string_arg cannot be an empty string or string with just spaces"
    );
  });

  test("strVal_only_digits", () => {
    expect(() => {
      validation.checkString("1234", "string_arg");
    }).toThrow(
      "Error: 1234 is not a valid value for string_arg as it only contains digits"
    );
  });

  test("valid_string", () => {
    expect(validation.checkString("this is a test", "string_arg")).toEqual(
      "this is a test"
    );
  });

  test("valid_string_trimmed", () => {
    expect(
      validation.checkString("         Hello, World!\t ", "string_arg")
    ).toEqual("Hello, World!");
  });
});

describe("checkStringArray", () => {
  test("no_args", () => {
    expect(() => {
      validation.checkStringArray();
    }).toThrow();
  });

  test("not_an_array", () => {
    expect(() => {
      validation.checkStringArray("hello", "string_array");
    }).toThrow("You must provide an array of string_array");
  });

  test("arr_is_undefined", () => {
    expect(() => {
      validation.checkStringArray(undefined, "string_array");
    }).toThrow("You must provide an array of string_array");
  });

  test("empty_array_is_valid", () => {
    expect(validation.checkStringArray([], "string_array")).toEqual([]);
  });

  test("elements_not_strings", () => {
    expect(() => {
      validation.checkStringArray([1, 2, 3, 4], "string_array");
    }).toThrow();
  });

  test("elements_empty_strings", () => {
    expect(() => {
      validation.checkStringArray(["", "", "", ""], "string_array");
    }).toThrow();
  });

  test("some_elements_not_strings", () => {
    expect(() => {
      validation.checkStringArray(["happy", "bday", 2, "you"], "string_array");
    }).toThrow();
  });

  test("some_element_empty_strings", () => {
    expect(() => {
      validation.checkStringArray(["hello", "", "world"], "sting_array");
    }).toThrow();
  });

  test("elements_string_just_spaces", () => {
    expect(() => {
      validation.checkStringArray(
        ["    ", "\t", "  \n", "\t\r"],
        "string_array"
      );
    }).toThrow();
  });

  test("some_elements_just_spaces", () => {
    expect(() => {
      validation.checkStringArray(["hello", "   ", "world"], "string_array");
    }).toThrow();
  });

  test("valid_string_array", () => {
    expect(
      validation.checkStringArray(["hello", "test"], "string_array")
    ).toEqual(["hello", "test"]);
  });

  test("valid_string_array_trimmed", () => {
    expect(
      validation.checkStringArray(["   hello\t", "test      "], "string_array")
    ).toEqual(["hello", "test"]);
  });

  test("nested_array_not_valid", () => {
    expect(() => {
      validation.checkStringArray([["hello"], ["there", "test"]]);
    }).toThrow();
  });
});

describe("checkDateString", () => {
  test("no_args", () => {
    expect(() => {
      validation.checkDateString();
    }).toThrow();
  });

  test("date_is_undefined", () => {
    expect(() => {
      validation.checkDateString(undefined, "string_arg");
    }).toThrow("Error: You must supply a string_arg");
  });

  test("date_not_a_string", () => {
    expect(() => validation.checkDateString(1, "string_arg")).toThrow(
      "Error: string_arg must be a string"
    );
  });

  test("date_empty_string", () => {
    expect(() => {
      validation.checkDateString("", "string_arg");
    }).toThrow();
  });

  test("date_just_spaces", () => {
    expect(() => {
      validation.checkDateString("     ", "string_arg");
    }).toThrow(
      "Error: string_arg cannot be an empty string or string with just spaces"
    );
  });

  test("date_invalid1", () => {
    expect(() => {
      validation.checkDateString("test");
    }).toThrow();
  });

  test("date_invalid2", () => {
    expect(() => {
      validation.checkDateString("21/02/2020"); // not MM/DD/YYYY format
    }).toThrow();
  });

  test("date_invalid3", () => {
    expect(() => {
      validation.checkDateString("5//2000");
    }).toThrow();
  });

  test("date_valid", () => {
    expect(validation.checkDateString("01/01/2020")).toEqual("01/01/2020");
  });

  test("date_valid_trimmed", () => {
    expect(validation.checkDateString("    01/01/2020")).toEqual("01/01/2020");
  });

  test("date_valid2", () => {
    expect(
      validation.checkDateString(
        "Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)",
        "date"
      )
    ).toEqual("Mon Nov 14 2023 00:05:49 GMT-0500 (Eastern Standard Time)");
  });
});
