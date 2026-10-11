# Al Huda Trust Frontend

React + Vite public website and admin dashboard.

## Run

1. Copy `.env.example` to `.env`.
2. `npm install`
3. `npm run dev`

Public site: `http://localhost:5173`
Admin: `http://localhost:5173/admin/login`

## Photo slideshow features
- The public homepage uses the `homepageSlides` site setting when configured; otherwise it shows the branded default hero.
- Trust Admin manages homepage slides from Admin → Website content. Photos upload to Cloudinary and slide settings are stored through the protected settings API.
- Institution cover photos can be uploaded while creating or editing an institution.
- Institution profile slideshows use the institution's `coverImageUrl` and `gallery` fields. Trust Admin can manage any institution; Institution Admin is restricted to assigned institutions.
- Configure Cloudinary credentials on the backend for uploads. Images are limited to JPEG, PNG, and WebP up to 5 MB.
