import {describe, test}  from "node:test";
import {deepStrictEqual} from "node:assert";

import {includeFiles, setFileReader} from "../index.mjs";

describe("includeFiles()", () => {
    test("single include", async () => {
        const html = "<div><!-- include(file.txt); --></div>";
        /** @type {(filename: string) => Promise<string>} */
        const fileReader = (filename) => {
            deepStrictEqual(filename, "file.txt");
            return new Promise((resolve) => resolve("Hello, World!"));
        };
        setFileReader(fileReader);
        const expected = "<div>Hello, World!</div>";
        const actual   = await includeFiles(html, ".");
        deepStrictEqual(actual, expected);
    });

    test("single include with quotes", async () => {
        const html = "<div><!-- include('my-file.html'); --></div>";
        /** @type {(filename: string) => Promise<string>} */
        const fileReader = (filename) => {
            deepStrictEqual(filename, "my-file.html");
            return new Promise((resolve) => resolve("Hello, my-file.html!"));
        };
        setFileReader(fileReader);
        const expected = "<div>Hello, my-file.html!</div>";
        const actual   = await includeFiles(html, ".");
        deepStrictEqual(actual, expected);
    });

    test("multiple includes in a single elems", async () => {
        const html = "<div><!-- include(file1.txt); --> <!-- include(file2.txt); --></div>";
        /** @type {(filename: string) => Promise<string>} */
        const fileReader = (filename) => {
            return new Promise((resolve) => resolve(`Hello, ${filename}!`));
        };
        setFileReader(fileReader);
        const expected = "<div>Hello, file1.txt! Hello, file2.txt!</div>";
        const actual   = await includeFiles(html, ".");
        deepStrictEqual(actual, expected);
    });

    test("multiple includes in separate elems", async () => {
        const html = "<div><!-- include(file3.txt); --></div>" +
            "<div><!-- include(file4.txt); --></div>";
        /** @type {(filename: string) => Promise<string>} */
        const fileReader = (filename) => {
            return new Promise((resolve) => resolve(`Hello, ${filename}!`));
        };
        setFileReader(fileReader);
        const expected = "<div>Hello, file3.txt!</div>" +
            "<div>Hello, file4.txt!</div>";
        const actual   = await includeFiles(html, ".");
        deepStrictEqual(actual, expected);
    });

    test("missing file", async () => {
        const html = "<div><!-- include(missing.txt); --></div>";
        /** @type {(filename: string) => Promise<string>} */
        const fileReader = (filename) => {
            void filename;
            return new Promise((_, reject) => reject(new Error("File not found")));
        };
        setFileReader(fileReader);
        const expected = "<div></div>";
        const actual   = await includeFiles(html, ".");
        deepStrictEqual(actual, expected);
    });

    test("error reading file", async () => {
        const html = "<div><!-- include(file.txt); --></div>";
        /** @type {(filename: string) => Promise<string>} */
        const fileReader = (filename) => {
            void filename;
            return new Promise((_, reject) => reject(new Error("Permission denied")));
        };
        setFileReader(fileReader);
        const expected = "<div></div>";
        const actual   = await includeFiles(html, ".");
        deepStrictEqual(actual, expected);
    });

    test("no includes", async () => {
        const html     = "<div>Hello, World!</div>";
        const expected = "<div>Hello, World!</div>";
        const actual   = await includeFiles(html, ".");
        deepStrictEqual(actual, expected);
    });

    test("empty string", async () => {
        const html     = "";
        const expected = "";
        const actual   = await includeFiles(html, ".");
        deepStrictEqual(actual, expected);
    });

    test("multiple occurrences", async () => {
        const html = "<div><!-- include(    file.txt); --></div><p><!-- include('file.txt'     ); --></p>";
        /** @type {(filename: string) => Promise<string>} */
        const fileReader = (filename) => {
            return new Promise((resolve) => resolve(`Hello, ${filename}!`));
        };
        setFileReader(fileReader);
        const expected = "<div>Hello, file.txt!</div><p>Hello, file.txt!</p>";
        const actual   = await includeFiles(html, ".");
        deepStrictEqual(actual, expected);
    });
});
