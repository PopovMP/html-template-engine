import {join}     from "node:path";
import {readFile} from "node:fs/promises";
import {logError} from "@popovmp/logger";

/** @type {(filename: string) => Promise<string>} */
let fileReader = (filename) => {
    return readFile(filename, {encoding: "utf8"});
};

/**
 * Template engine - renders HTML templates.
 *
 * Syntax:
 *   <!-- key --> - placeholder for the value from the view model
 *   <!-- include(filename.html); --> - include a file
 *   <!-- includeIf(property, filename.html); --> - include a file conditionally
 *   <!-- renderIf(property); --> ... <!-- endIf(); --> - render content conditionally
 */

/**
 * Set a custom file reader function.
 *
 * @param {(filename: string) => Promise<string>} reader
 * @returns {void}
 */
export function setFileReader(reader) {
    fileReader = reader;
}

/**
 * Render the HTML template with the view model.
 *
 * The template can include placeholders, file includes and conditional rendering.
 *
 * ```javascript
 * const html = "<h1><!-- title --></h1>" +
 *   "<!-- include(hello-world.txt); -->" +
 *   "<!-- includeIf(hello, hello-world.txt); -->" +
 *   "<!-- renderIf(section); -->" +
 *   "  <h2>Section</h2>" +
 *   "<!-- endIf(); -->";
 *
 * const viewModel = { title: "Hello, World!", hello: true, section: true };
 * const result = await renderTemplate(html, viewModel, ".");
 * ```
 * @param   {string}                                html
 * @param   {Record<string, string|boolean|number>} viewModel
 * @param   {string}                                baseDir
 * @returns {Promise<string>}
 */
export async function renderTemplate(html, viewModel, baseDir) {
    html = renderIf(html, viewModel);
    html = replacePlaceholders(html, viewModel);

    html = await includeFilesIf(html, baseDir, viewModel);
    html = await includeFiles(html, baseDir);

    html = renderIf(html, viewModel);
    html = replacePlaceholders(html, viewModel);

    return minifyHtml(html);
}

/**
 * Replace placeholders in the HTML with the values from the view model.
 *
 * Template syntax: `<!-- key -->`
 *
 * Where `key` is a property in the viewModel.
 *
 * ```javascript
 * const html = "<h1><!-- title --></h1>";
 * const viewModel = { title: "Hello, World!" };
 * const result = replacePlaceholders(html, viewModel);
 * console.log(result); // "<h1>Hello, World!</h1>"
 * ```
 *
 * @param   {string}                                html
 * @param   {Record<string, string|boolean|number>} viewModel
 * @returns {string}
 */
export function replacePlaceholders(html, viewModel) {
    return html.replace(/<!--\s*(\w+)\s*-->/g, replacer);

    /**
     * Replaces the placeholder with the value from the view model.
     * @param {string} match
     * @param {string} key
     * @returns {string}
     */
    function replacer(match, key) {
        return viewModel[key] ? String(viewModel[key]) : match;
    }
}

/**
 * Include files in the HTML.
 *
 * Template syntax: `<!-- include(filename.html); -->`
 *
 * ```javascript
 * const html = "<div><!-- include(hello-world.txt); --></div>";
 * const result = await includeFiles(html, ".");
 * console.log(result); // "<div>Hello, World!</div>"
 * ```
 *
 * @param   {string} html
 * @param   {string} baseDir
 * @returns {Promise<string>}
 */
export async function includeFiles(html, baseDir) {
    const includeRegEx = /<!--\s*include\(([^)]+)\);?\s*-->/g;
    const replacements = [];

    let match;
    while ((match = includeRegEx.exec(html)) !== null) {
        const filename = match[1].trim();
        try {
            const filePath    = join(baseDir, filename);
            const fileContent = await fileReader(filePath);
            replacements.push({match: match[0], content: fileContent});
        } catch (/** @type {any} */ error) {
            replacements.push({match: match[0], content: ""});
            logError(
                `Error including file: ${filename}: ${error.message}`,
                "html-template-engine :: include",
            );
        }
    }

    for (const rpl of replacements) {
        html = html.replaceAll(rpl.match, rpl.content);
    }

    return html;
}

/**
 * Include files conditionally in the HTML.
 *
 * Template syntax: `<!-- includeIf(isInclude, filename.html); -->`
 *
 * Where `isInclude` is a property in the viewModel.
 *
 * If the property is `true`, the file is loaded and its content replaces the placeholder.
 *
 * ```javascript
 * const html = "<div><!-- includeIf(show, hello-world.txt); --></div>";
 * const viewModel = { show: true };
 * const result = await includeFilesIf(html, ".", viewModel);
 * console.log(result); // "<div>Hello, World!</div>"
 * ```
 *
 * @param   {string}                                html
 * @param   {string}                                baseDir
 * @param   {Record<string, string|boolean|number>} viewModel
 * @returns {Promise<string>}
 */
export async function includeFilesIf(html, baseDir, viewModel) {
    const includeIfRegEx = /<!--\s*includeIf\(([^,]+),([^)]+)\);?\s*-->/g;
    let match;
    while ((match = includeIfRegEx.exec(html)) !== null) {
        const key      = match[1].trim();
        const filename = match[2].trim();
        try {
            if (viewModel[key]) {
                const filePath    = join(baseDir, filename);
                const fileContent = await fileReader(filePath);
                html = html.replace(match[0], fileContent);
            } else {
                html = html.replace(match[0], "");
            }
        } catch (/** @type {any} */ error) {
            html = html.replace(match[0], "");
            logError(
                `Error including file: ${filename}: ${error.message}`,
                "html-template-engine :: includeIf",
            );
        }
    }
    return html;
}

/**
 * Render the content conditionally.
 *
 * <h1>Template file</h1>
 * <!-- renderIf(property); -->
 *  <h2>Content to render if the property is true.</h2>
 * <!-- endIf(); -->
 *
 * ```javascript
 * const html = "<h1>Template file</h1>" +
 *   "<!-- renderIf(show); -->" +
 *     "<h2>Shown</h2>" +
 *   "<!-- endIf(); -->" +
 *   "<!-- renderIf(dontShow); -->" +
 *     "<h2>Not shown</h2>" +
 *   "<!-- endIf(); -->";
 * ;
 * const viewModel = { show: true, dontShow: false };
 * const result = renderIf(html, viewModel);
 * console.log(result); // "<h1>Template file</h1><h2>Shown</h2>"
 * ```
 *
 * @param   {string}                                html
 * @param   {Record<string, string|boolean|number>} viewModel
 * @returns {string}
 */
export function renderIf(html, viewModel) {
    const regExp = /<!--\s*renderIf\(([^)]+)\);?\s*-->([\s\S]*?)<!--\s*endIf\(\);?\s*-->/g;
    return html.replace(regExp, replacer);

    /**
     * Replaces the content conditionally.
     * @param {string} _
     * @param {string} key
     * @param {string} content
     * @returns {string}
     */
    function replacer(_, key, content) {
        return viewModel[key] ? content : "";
    }
}

/**
 * Minify the HTML - compacts spaces, removes comments.
 *
 * ```javascript
 * const html = "   <div><span>Hello, World!</span><!-- My comment --></div>";
 * minifyHtml(html); // "<div><span>Hello, World!</span></div>";
 * ```
 * @param   {string} html
 * @returns {string}
 */
export function minifyHtml(html) {
    return html
        .replace(/\s+/gm, " ") // Replaces multiple spaces with a single space
        .replace(/<!--[\s\S]*?-->/g, ""); // Remove comments
}
