import {describe, test}  from "node:test";
import {deepStrictEqual} from "node:assert";

import {includeFilesIf, setFileReader} from "../index.mjs";

describe("includeFilesIf()", () => {
  test("single include", async () => {
    const html       = "<div><!-- includeIf(isInclude, filename.txt); --></div>";
    const viewModel  = {isInclude: true};
    /** @type {(filename: string) => Promise<string>} */
    const fileReader = (filename) => {
      return new Promise((resolve) => resolve(`Hello, ${filename}!`));
    };
    setFileReader(fileReader);
    const actual   = await includeFilesIf(html, ".", viewModel);
    const expected = "<div>Hello, filename.txt!</div>";
    deepStrictEqual(actual, expected);
  });

  test("single include with quotes", async () => {
    const html       = "<div><!-- includeIf(isInclude, 'world.txt'); --></div>";
    const viewModel  = {isInclude: true};
    /** @type {(filename: string) => Promise<string>} */
    const fileReader = (filename) => {
      return new Promise((resolve) => resolve(`Hello, ${filename}!`));
    };
    setFileReader(fileReader);
    const actual   = await includeFilesIf(html, ".", viewModel);
    const expected = "<div>Hello, world.txt!</div>";
    deepStrictEqual(actual, expected);
  });

  test("include false", async () => {
    const html       = "<div><!-- includeIf(isInclude, filename.txt); --></div>";
    const viewModel  = {isInclude: false};
    /** @type {(filename: string) => Promise<string>} */
    const fileReader = (filename) => {
      void filename;
      throw new Error("File should not be included");
    };
    setFileReader(fileReader);
    const actual = await includeFilesIf(html, ".", viewModel);
    deepStrictEqual(actual, html);
  });

  test("missing file", async () => {
    const html       = "<div><!-- includeIf(isInclude, 'missing.txt'); --></div>";
    const viewModel  = {isInclude: true};
    /** @type {(filename: string) => Promise<string>} */
    const fileReader = (filename) => {
      void filename;
      return new Promise((_, reject) => reject(new Error("File not found")));
    };
    setFileReader(fileReader);
    const actual   = await includeFilesIf(html, ".", viewModel);
    const expected = "<div></div>";
    deepStrictEqual(actual, expected);
  });
});
