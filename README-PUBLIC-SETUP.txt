FUMC SOH FRAME CREATOR - PUBLIC NO-LOGIN BUILD

1. Upload the contents of this folder to the root of your GitHub Pages repository.
2. In Firebase Console > Firestore Database > Rules, paste the contents of firestore.rules and click Publish.
3. Confirm the Cloudinary unsigned upload preset named "frame_upload" is enabled for image uploads.
4. Open your GitHub Pages site. index.html redirects to dashboard.html.
5. Add a frame in Dashboard. Copy its public link and share it. Visitors do not need to sign in.

IMPORTANT SECURITY NOTICE
These Firestore rules intentionally allow anyone on the internet to read, create, update, and delete every document in the "frames" collection. Anyone can bypass the dashboard and directly change the database. Do not store private data in this collection. If you later want to protect frame records, replace these rules with authenticated/admin-only rules.

This project uses Cloudinary for frame image uploads. The Cloudinary upload preset is client-visible and should be configured with suitable upload restrictions and usage limits.
