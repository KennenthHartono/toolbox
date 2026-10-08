# KENNENTH TOOLBOX
Static launcher for Kennenth's web tools. No build, no backend — open `index.html` or deploy to GitHub Pages.

## Add a tool
Open `js/tools.js` and add one object to the `tools` array:

```js
{ id: "image-compressor", name: "Image Compressor", description: "Compress images quickly.",
  category: "Image", icon: "🗜", url: "https://example.github.io/image-compressor/",
  github: "https://github.com/example/image-compressor", status: "available", badge: "NEW" }
```
New categories get a filter button automatically. `badge` and `github` are optional.

## Deploy
Push to a repo, then Settings → Pages → deploy from the main branch (root).
