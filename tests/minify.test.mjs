import {describe, test}            from "node:test";
import {deepStrictEqual} from "node:assert";

import {minifyHtml} from "../index.mjs";


describe("minifyHtml()", () => {
    test("replaces leading whitespaces with a space", () => {
        const html     = "   <div><span>Hello, World!</span></div>";
        const expected = " <div><span>Hello, World!</span></div>";
        const actual   = minifyHtml(html);
        deepStrictEqual(actual, expected);
    });

    test("compacts multiline input", () => {
        const html = `
<div>


    <span>Hello</span>,

    World!

</div>`;
        const expected = " <div> <span>Hello</span>, World! </div>";
        const actual   = minifyHtml(html);
        deepStrictEqual(actual, expected);
    });

    test("removes comments", () => {
        const html     = "<div><!-- comment --></div>";
        const expected = "<div></div>";
        const actual   = minifyHtml(html);
        deepStrictEqual(actual, expected);
    });

    test("removes multiline comments", () => {
        const html     = "<div><!--\ncomment\n--></div>";
        const expected = "<div></div>";
        const actual   = minifyHtml(html);
        deepStrictEqual(actual, expected);
    });
});
