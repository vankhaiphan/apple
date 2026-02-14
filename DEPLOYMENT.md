# Deployment Guide

## GitHub Pages Deployment

### Method 1: Automatic Deployment (Recommended)

The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to the main branch.

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: The Love Tree"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/love-tree.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Build and deployment", set Source to "GitHub Actions"
   - Save the settings

3. **Wait for deployment:**
   - The workflow will automatically run
   - Check the "Actions" tab to see progress
   - Once complete, your site will be live at: `https://YOUR_USERNAME.github.io/love-tree/`

### Method 2: Manual Deployment

If you prefer manual deployment:

```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

This will:
1. Build the project
2. Create a `gh-pages` branch
3. Push the built files to that branch
4. GitHub Pages will serve from the `gh-pages` branch

### Important Configuration

**vite.config.js:**
```javascript
export default defineConfig({
  base: '/love-tree/', // Must match your repository name
})
```

If your repository name is different, update this line accordingly.

### Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public/` folder:
   ```
   yourdomain.com
   ```

2. Configure your domain's DNS settings:
   - Add an A record pointing to GitHub's IP addresses
   - Or add a CNAME record pointing to `YOUR_USERNAME.github.io`

3. In GitHub repository settings, add your custom domain under "Pages"

## Vercel Deployment (Alternative)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts and your site will be live!

## Netlify Deployment (Alternative)

1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Build and deploy:
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

## Troubleshooting

### 404 Errors
- Ensure `base` in vite.config.js matches your repository name
- Check that GitHub Pages is enabled in repository settings
- Verify the deployment workflow completed successfully

### Assets Not Loading
- Check that all paths in letters.json use absolute paths starting with `/`
- Ensure audio files are in the `public/audio/` directory
- Verify the build completed without errors

### Build Failures
- Run `npm run build` locally to test
- Check for any console errors
- Ensure all dependencies are installed

## Pre-Deployment Checklist

- [ ] Update letters.json with your personal messages
- [ ] Add your audio files to public/audio/
- [ ] Test locally with `npm run dev`
- [ ] Build successfully with `npm run build`
- [ ] Preview build with `npm run preview`
- [ ] Update vite.config.js base path if needed
- [ ] Commit all changes
- [ ] Push to GitHub
- [ ] Enable GitHub Pages in settings
- [ ] Wait for deployment to complete
- [ ] Test live site

## Audio Files Setup

Before deploying, ensure you have audio files:

1. Record your voice messages
2. Convert to MP3 (128kbps recommended)
3. Name them consistently (e.g., letter-001.mp3, letter-002.mp3)
4. Place in `public/audio/` directory
5. Update audioFile paths in letters.json

## Performance Tips

For best performance on GitHub Pages:

1. Optimize audio files (use 128kbps MP3)
2. Keep audio files under 5MB each
3. Limit total number of fruits to 15-20 for best performance
4. Test on mobile devices before deployment

## Privacy Considerations

Since GitHub Pages is public:
- Your love letters will be publicly readable in the source code
- Audio files will be publicly accessible
- Consider this before deploying personal messages

Alternative: Deploy to a private hosting service or password-protect the site.
