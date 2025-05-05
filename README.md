# HTML Template Engine

The template engine encodes the operations within HTML comments.

The purpose is to have absolutely valid HTML templates.

```html
Replace the placeholder with the value of `viewModel.key`.
<!-- key -->

Include the file content
<!-- include(filename.html); -->

The file content will be included if `viewModel.isInclude` is true.
<!-- includeIf(isInclude, filename.html); -->

<!-- renderIf(property); -->
This content is conditional
<!-- endIf(); -->
```

## Examples:

### Render a template

```javascript
const html = `
    <h1><!-- title --></h1>
    <!-- include(hello-world.html); -->
    <!-- includeIf(hello, hello-world.html); -->
    <!-- renderIf(section); -->
        <h2>Section</h2>
    <!-- endIf(); -->`;
const viewModel = { title: "Hello, World!", hello: true, section: true };
const result    = await renderTemplate(html, viewModel, ".");
```

### Replace placeholders in the HTML with the values from the view model.

Template syntax: `<!-- key -->` Where `key` is a property in the viewModel.

```javascript
const html      = "<h1><!-- title --></h1>";
const viewModel = { title: "Hello, World!" };
const result    = replacePlaceholders(html, viewModel);
console.log(result); // "<h1>Hello, World!</h1>"
```

### Include files in the HTML template.

Template syntax: `<!-- include(filename.html); -->`

```javascript
const html   = "<div><!-- include(hello-world.txt); --></div>";
const result = await includeFiles(html, ".");
console.log(result); // "<div>Hello, World!</div>"
```

### Include files conditionally in the HTML.

Template syntax: `<!-- includeIf(isInclude, filename.html); -->` Where
`isInclude` is a property in the viewModel. If the property is `true`, the file
is loaded and its content replaces the placeholder.

If the property is `false`, the function does not check for the file and does not remove the comment.
Yuo can use the `minifyHtml` function ot remove all the HTML comments later.

```javascript
const html      = "<div><!-- includeIf(show, hello-world.html); --></div>";
const viewModel = { show: true };
const result    = await includeFilesIf(html, ".", viewModel);
console.log(result); // "<div>Hello, World!</div>"
```

### Render the content conditionally.

```html
<h1>Template file</h1>
<!-- renderIf(property); -->
    <h2>Content to render if the property is true.</h2>
<!-- endIf(); -->
```

```javascript
const html =
    <h1>Template file</h1>
    <!-- renderIf(show); -->
    <h2>Shown</h2>
    <!-- endIf(); -->
    <!-- renderIf(dontShow); -->
        <h2>Not shown</h2>
    <!-- endIf(); -->`;

const viewModel = { show: true, dontShow: false };
const result    = renderIf(html, viewModel);
console.log(result); // "<h1>Template file</h1><h2>Shown</h2>"
```

### Minify the HTML - remove leading spaces, empty lines and trim.

```javascript
const html   = "  <div><span>Hello, World!</span><!-- Comment  --></div>  ";
const result = minifyHtml(html); //=> "<div><span>Hello, World!</span></div>"
```
