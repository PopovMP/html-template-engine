// types/index.d.ts
// noinspection JSUnusedGlobalSymbols

declare module "@popovmp/html-template-engine" {

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
    export async function renderTemplate(
        html     : string,
        viewModel: Record<string, string|boolean|number>,
        baseDir  : string,
    ): Promise<string>;

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
    export function replacePlaceholders(html: string, viewModel: Record<string, string|boolean|number>): string

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
    export async function includeFiles(html: string, baseDir: string): Promise<string>;

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
    export async function includeFilesIf(
        html     : string,
        baseDir  : string,
        viewModel: Record<string, string|boolean|number>,
    ): Promise<string>;

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
    export function renderIf(html: string, viewModel: Record<string, string|boolean|number>): string;

    /**
     * Minify the HTML - remove leading spaces, empty lines, comments and trims the lines.
     *
     * ```javascript
     * const html = "   <div><span>Hello, World!</span><!-- My comment --></div>  ";
     * minifyHtml(html); // "<div><span>Hello, World!</span></div>";
     * ```
     * @param   {string} html
     * @returns {string}
     */
    export function minifyHtml(html: string): string
}
