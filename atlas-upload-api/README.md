# Atlas photo upload service

The API saves optimized JPEG portraits in miron-droid/ari-email-logo, atlas/dispatchers/. Portraits are public. GitHub credentials never enter the browser. Identical uploads reuse the same path. Images are decoded, resized to 480 × 640, and re-encoded without original metadata.

## One-time configuration

1. Create a fine-grained GitHub token for only `miron-droid/ari-email-logo`, Contents: read and write. Store it as the server environment variable `GITHUB_UPLOAD_TOKEN`, never in HTML or Git.
2. Set `ATLAS_UPLOAD_CODE` to a long random shared code. Give it to authorized dispatchers. This code permits only portrait uploads, not repository management.
3. Deploy this directory to Vercel using `npx vercel --prod`. Existing Vercel login may need refreshing.
4. In the accompanying upload-photo.js, replace `UPLOAD_ENDPOINT` with the deployed `/api/upload` URL, then embed the controls and script in the Atlas editor.

Do not publish the upload controls until a real upload has passed end to end. Existing signatures remain usable while configuration is pending.
