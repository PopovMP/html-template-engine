import {describe, test}  from "node:test";
import {deepStrictEqual} from "node:assert";

import {renderIf} from "../index.mjs";

describe("renderIf()", () => {
  test("single render", () => {
    const html      = "<div><!-- renderIf(show); -->Hello, World!<!-- endIf(); --></div>";
    const viewModel = {show: true};
    const expected  = "<div>Hello, World!</div>";
    const actual    = renderIf(html, viewModel);
    deepStrictEqual(actual, expected);
  });

  test("multiple renders", () => {
    const html      = "" +
      "<div><!-- renderIf(show); -->" +
      "Hello, <!-- endIf(); -->" +
      "<!-- renderIf(show); -->" +
      "World!<!-- endIf(); --></div>";
    const viewModel = {show: true};
    const expected  = "<div>Hello, World!</div>";
    const actual    = renderIf(html, viewModel);
    deepStrictEqual(actual, expected);
  });

  test("no render", () => {
    const html      = "<div><!-- renderIf(show); -->Hello, World!<!-- endIf(); --></div>";
    const viewModel = {show: false};
    const expected  = "<div></div>";
    const actual    = renderIf(html, viewModel);
    deepStrictEqual(actual, expected);
  });
});
