# 🌳 The Love Tree - Quick Start Guide

## ✅ What's Been Created

A complete, production-ready interactive romantic web experience featuring:

### Core Features Implemented
✅ **3D Living Tree** - Breathing animations, subtle sway
✅ **Interactive Fruits** - 9 sample love letters with glow effects
✅ **Letter System** - Envelope transformation animations
✅ **Audio System** - Voice playback with controls
✅ **Visual Effects** - Bloom, particles, romantic lighting
✅ **Mobile Support** - Touch gestures, responsive design
✅ **GitHub Pages Ready** - Automated deployment workflow

## 🚀 Getting Started (3 Steps)

### 1. Start Development Server
```bash
npm run dev
```
Visit `http://localhost:5173`

### 2. Customize Your Letters
Edit `src/data/letters.json`:
- Update messages with your personal love letters
- Change dates and unlock settings
- Adjust fruit positions on the tree

### 3. Add Your Audio (Optional but Recommended)
- Record your voice messages (see AUDIO_GUIDE.md)
- Convert to MP3 (128kbps)
- Place in `public/audio/`
- Name them: letter-001.mp3, letter-002.mp3, etc.

## 📝 Customization Checklist

Essential customizations before deploying:

- [ ] Update messages in `letters.json` with your personal letters
- [ ] Record and add audio files to `public/audio/`
- [ ] Adjust unlock dates to meaningful dates
- [ ] Update repository name in `vite.config.js` if needed
- [ ] Test on desktop and mobile
- [ ] Build successfully: `npm run build`

## 🎨 Sample Letter Structure

Found in `src/data/letters.json`:

```json
{
  "id": "mem-001",
  "branch": "memories",
  "title": "Our First Meeting",
  "message": "Your heartfelt message here...",
  "audioFile": "/audio/letter-001.mp3",
  "position": [-2.5, 2.8, 1.2],
  "unlocked": true,
  "unlockDate": "2024-01-14",
  "date": "2024-01-14"
}
```

## 🌿 Branch Categories

The tree has 5 branches representing different themes:

1. **Memories** (Pink #f5a8b8) - Moments you've shared
2. **Admiration** (Rose #ef7895) - Things you admire
3. **Gratitude** (Deep Pink #e54d76) - Thank you messages
4. **Dreams** (Magenta #d02e5f) - Future together
5. **Things I've Never Said** (Burgundy #ae204e) - Heartfelt confessions

## 🎯 Key Files to Customize

| File | Purpose | What to Change |
|------|---------|---------------|
| `src/data/letters.json` | Letter content | Messages, dates, positions |
| `public/audio/*.mp3` | Voice recordings | Replace with your recordings |
| `vite.config.js` | Deployment config | Repository name |
| `src/components/Tree/Branches.jsx` | Tree structure | Add/remove branches |

## 🌐 Deployment Options

### Option 1: GitHub Pages (Automatic)
```bash
git init
git add .
git commit -m "Initial commit: The Love Tree"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/love-tree.git
git push -u origin main
```

Then enable GitHub Pages in repository settings (set source to "GitHub Actions").

### Option 2: Manual Deployment
```bash
npm run deploy
```

### Option 3: Vercel/Netlify
See DEPLOYMENT.md for detailed instructions.

## 🎮 Controls

**Desktop:**
- Click and drag to rotate the tree
- Scroll to zoom in/out
- Click fruits to read letters

**Mobile:**
- Touch and drag to rotate
- Pinch to zoom
- Tap fruits to read letters

## 📱 Testing Checklist

Before deploying:

- [ ] Letters display correctly
- [ ] Audio plays (if added)
- [ ] Fruits glow and pulse
- [ ] Envelope animation works
- [ ] Close button works
- [ ] Mobile gestures work
- [ ] All fruits are clickable
- [ ] Locked fruits show unlock date
- [ ] Mute button functions

## 🎨 Visual Customization

### Change Colors
Edit `src/index.css` in the `@theme` section:
```css
--color-romantic-500: #your-color;
```

### Adjust Tree Size
Edit `src/components/Tree/Trunk.jsx`, `Branches.jsx`, `Leaves.jsx`

### Change Particle Count
Edit `src/components/Effects/FloatingParticles.jsx`:
```javascript
const particleCount = 200; // Adjust this number
```

## 🔊 Audio Setup

If you don't have audio files yet:
1. The app works in text-only mode
2. See AUDIO_GUIDE.md for recording tips
3. Use text-to-speech as temporary placeholder
4. Add real recordings later

## 🐛 Common Issues & Fixes

### Build Fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Audio Won't Play
- Check file is MP3 format
- Verify path in letters.json
- Ensure file is in public/audio/

### Fruits Don't Appear
- Check position coordinates in letters.json
- Ensure unlocked: true for testing
- Verify JSON syntax is valid

### GitHub Pages 404
- Update `base` in vite.config.js to match repo name
- Check GitHub Pages settings
- Verify workflow completed successfully

## 📦 Project Structure

```
love-tree/
├── src/
│   ├── components/
│   │   ├── Scene/       - 3D environment
│   │   ├── Tree/        - Tree system
│   │   ├── Fruit/       - Interactive fruits
│   │   ├── Letter/      - Letter UI
│   │   ├── UI/          - Overlays
│   │   └── Effects/     - Visual effects
│   ├── data/
│   │   └── letters.json - YOUR LETTERS HERE
│   └── hooks/           - State management
├── public/
│   └── audio/           - YOUR AUDIO FILES HERE
└── dist/                - Built files (generated)
```

## 🎨 Tech Stack

- React 19 + Vite 7
- React Three Fiber (3D)
- Three.js
- GSAP (Animations)
- Framer Motion (UI)
- TailwindCSS v4
- Zustand (State)

## 📚 Documentation

- `README.md` - Full documentation
- `DEPLOYMENT.md` - Deployment guide
- `AUDIO_GUIDE.md` - Audio recording tips
- `QUICK_START.md` - This file

## 💡 Tips for Best Results

1. **Messages**: Keep 150-300 words per letter
2. **Audio**: 1-3 minutes per recording
3. **Dates**: Use anniversary, first date, etc.
4. **Testing**: Test on Chrome, Safari, Firefox
5. **Mobile**: Test on actual phones, not just browser dev tools

## 🎉 You're Ready!

Everything is set up and ready to go. Just:
1. Customize the letters
2. Add your audio
3. Deploy

The tree will grow, fruits will glow, and your love will shine! 💕

## 🆘 Need Help?

Check these files:
- Full docs: `README.md`
- Deployment help: `DEPLOYMENT.md`
- Audio help: `AUDIO_GUIDE.md`

## 🌟 Final Notes

This is a poetic, magical experience - not a typical web app.
Take your time personalizing it. Make it uniquely yours.
The most important thing is the emotion and love you put into the messages.

**Made with 💕**
