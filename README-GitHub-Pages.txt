# PlantPower — GitHub Pages PWA files

## Put the files in your repository

Use this structure (the HTML file must be named `index.html`):

```text
your-repository/
├── index.html                 # Rename PlantPower_complete.html to this
├── manifest.webmanifest       # Supplied
├── sw.js                      # Supplied
└── icons/
    ├── plantpower-192.png     # You add this icon (192 × 192)
    └── plantpower-512.png     # You add this icon (512 × 512)
```

Your HTML already links to `manifest.webmanifest`, registers `./sw.js`, and
references `icons/plantpower-192.png` as its Apple touch icon. The manifest
expects the two PNG icon files shown above. Add your own icons at those exact
paths, or edit the paths in the manifest and HTML to match your filenames.

## Publish with GitHub Pages

1. Create a GitHub repository and upload the files using the structure above.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select your publishing branch (usually `main`) and folder (`/ (root)`), then save.
5. Wait for GitHub Pages to publish, then open the URL shown in Settings → Pages.

The supplied manifest and service worker use relative paths, so they support
both a user-site URL and a project-site URL such as
`https://username.github.io/repository-name/`.

## Important notes from reviewing the HTML

- The HTML already has the manifest link and service-worker registration. You
  do not need to add a second registration.
- GitHub Pages serves over HTTPS, which is required for service workers and
  PWA installation (except on localhost during development).
- The app stores farm entries, settings, and diagnosis history in the browser's
  local storage. Those records are per browser/device; GitHub Pages does not
  sync them between devices.
- Crop photo identification calls the Plant.id API directly from browser code.
  The uploaded HTML contains a live-looking API key in client-side JavaScript.
  Treat it as exposed: revoke/rotate it with the provider before publishing.
  Do not put a replacement secret key in public HTML or in this repository.
  A secure server-side proxy is needed if you want to keep the API key private.
- The service worker caches the app entry page and manifest for offline opening.
  Plant.id photo analysis still requires an internet connection.
