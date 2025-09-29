import {describe, test}  from "node:test";
import {deepStrictEqual} from "node:assert";

import {replacePlaceholders} from "../index.mjs";

describe("replacePlaceholders()", () => {
  test("existing property", () => {
    const html      = "<h1><!-- title --></h1>";
    const viewModel = {title: "Hello, World!"};
    const expected  = "<h1>Hello, World!</h1>";
    const actual    = replacePlaceholders(html, viewModel);
    deepStrictEqual(actual, expected);
  });

  test("undefined property", () => {
    const html      = "<p><!-- content --></p>";
    const viewModel = {foo: "bar"};
    const expected  = "<p><!-- content --></p>";
    const actual    = replacePlaceholders(html, viewModel);
    deepStrictEqual(actual, expected);
  });

  test("multiple properties", () => {
    const html      = "<h1><!-- title --></h1><p><!-- content --></p>";
    const viewModel = {title: "Hello, World!", content: "Welcome!"};
    const expected  = "<h1>Hello, World!</h1><p>Welcome!</p>";
    const actual    = replacePlaceholders(html, viewModel);
    deepStrictEqual(actual, expected);
  });

  test("multiple occurrences", () => {
    const html      = "<h1><!-- title --></h1><p><!-- title --></p>";
    const viewModel = {title: "Hello, World!"};
    const expected  = "<h1>Hello, World!</h1><p>Hello, World!</p>";
    const actual    = replacePlaceholders(html, viewModel);
    deepStrictEqual(actual, expected);
  });

  test("empty string", () => {
    const html      = "";
    const viewModel = {title: "Hello, World!"};
    const expected  = "";
    const actual    = replacePlaceholders(html, viewModel);
    deepStrictEqual(actual, expected);
  });

  test("no placeholders", () => {
    const html      = "<h1>Hello, World!</h1>";
    const viewModel = {title: "Hello, World!"};
    const expected  = "<h1>Hello, World!</h1>";
    const actual    = replacePlaceholders(html, viewModel);
    deepStrictEqual(actual, expected);
  });
});
