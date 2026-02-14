# 🌳 The Love Tree

A premium AAA-quality interactive romantic web experience. An immersive 3D poetic journey where love letters grow as glowing fruits on a magical tree.

![The Love Tree](https://img.shields.io/badge/Status-Live-success) ![React](https://img.shields.io/badge/React-19.2.0-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.182.0-green)

## ✨ Features

### 🎨 Visual Experience
- **Living 3D Tree** - Breathes and sways with subtle animations
- **Glowing Fruits** - Each fruit represents a love letter with soft pulsing glow
- **Magical Interactions** - Fruits transform into envelopes and letters
- **Cinematic Animations** - GSAP-powered smooth transitions
- **Particle Effects** - Floating romantic particles with bloom effects
- **Romantic Color Palette** - Soft pinks, warm glows, elegant gradients

### 💌 Letter System
- **Branch Categories**:
  - 💭 **Memories** - Moments we've shared
  - ⭐ **Admiration** - Things I admire about you
  - 🙏 **Gratitude** - Thank you for...
  - 🌟 **Dreams** - Our future together
  - 💕 **Things I've Never Said** - Words from my heart

- **Unlock System** - Letters unlock on specific dates
- **Audio Playback** - Voice messages with elegant controls
- **Paper Letter UI** - Textured paper effect with sparkle animations

### 🎵 Audio
- **Voice Messages** - Personal audio recordings for each letter
- **Ambient Sound** - Soft background ambience
- **Audio Controls** - Play, pause, seek, and replay options
- **Mute Toggle** - User-controlled sound

### 📱 Mobile-Friendly
- **Touch Gestures** - Tap, pinch, and drag support
- **Responsive Design** - Works beautifully on all devices
- **Optimized Performance** - Instanced rendering for fruits

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/love-tree.git
cd love-tree

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see your Love Tree!

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

Or use the included GitHub Actions workflow for automatic deployment on push to main branch.

### Manual GitHub Pages Setup
1. Go to your repository settings
2. Navigate to Pages section
3. Set source to "GitHub Actions"
4. Push to main branch to trigger deployment

## 🎨 Customization

### Adding Your Letters

Edit `src/data/letters.json`:

```json
{
  "id": "unique-id",
  "branch": "memories",
  "title": "Your Letter Title",
  "message": "Your heartfelt message...",
  "audioFile": "/audio/your-audio.mp3",
  "position": [x, y, z],
  "unlocked": true,
  "unlockDate": "2024-02-14",
  "date": "2024-02-14"
}
```

### Adding Audio Files

1. Record your voice message
2. Convert to MP3 format (recommended: 128kbps)
3. Place in `public/audio/` folder
4. Reference in letters.json: `"/audio/filename.mp3"`

### Branch Categories

Each branch has a unique color and represents a theme:

```json
{
  "memories": {
    "name": "Memories",
    "color": "#f5a8b8",
    "description": "Moments we've shared"
  }
}
```

### Fruit Positions

Position fruits on the tree using 3D coordinates `[x, y, z]`:
- **x**: Left (-) to Right (+)
- **y**: Bottom to Top (2.0 to 4.0 recommended)
- **z**: Back (-) to Front (+)

Tips:
- Keep y between 2.0 and 4.0 for best visibility
- Distribute fruits evenly around the tree
- Use values between -3 and 3 for x and z

## 🛠️ Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **React Three Fiber** - 3D rendering
- **@react-three/drei** - R3F helpers
- **@react-three/postprocessing** - Visual effects
- **Three.js** - 3D engine
- **GSAP** - Animation library
- **Framer Motion** - UI animations
- **TailwindCSS** - Styling
- **Zustand** - State management
- **Lucide React** - Icons

## 📁 Project Structure

```
love-tree/
├── public/
│   └── audio/              # Audio files
├── src/
│   ├── components/
│   │   ├── Scene/          # 3D Scene setup
│   │   ├── Tree/           # Tree components
│   │   ├── Fruit/          # Fruit system
│   │   ├── Letter/         # Letter UI
│   │   ├── UI/             # Overlays
│   │   └── Effects/        # Visual effects
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Utilities
│   ├── data/
│   │   └── letters.json    # Your letters
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .github/
│   └── workflows/
│       └── deploy.yml      # Auto-deployment
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎯 Key Components

### Tree System
- `Tree.jsx` - Main tree with growth animation
- `Trunk.jsx` - Tree trunk
- `Branches.jsx` - Branch structure
- `Leaves.jsx` - Animated leaves

### Fruit System
- `Fruits.jsx` - Fruit container
- `Fruit.jsx` - Interactive fruit with states

### Letter Experience
- `LetterView.jsx` - Letter modal with envelope animation
- `AudioControls.jsx` - Audio player controls

### Effects
- `FloatingParticles.jsx` - Ambient particles
- `AmbientSound.jsx` - Background audio
- Bloom post-processing effects

## 🎨 Customization Guide

### Colors

Edit `tailwind.config.js` to change the romantic color palette:

```javascript
colors: {
  romantic: {
    50: '#fdf4f5',  // Lightest
    500: '#e54d76', // Primary
    900: '#7b1c40', // Darkest
  },
}
```

### Animations

Adjust animation durations in `letters.json`:

```json
"settings": {
  "treeGrowthDuration": 3000,
  "fruitPulseDuration": 4000,
  "envelopeTransformDuration": 2000
}
```

### Camera & Controls

Modify in `SceneContent.jsx`:

```javascript
<OrbitControls
  minDistance={5}
  maxDistance={15}
  minPolarAngle={Math.PI / 6}
  maxPolarAngle={Math.PI / 2}
/>
```

## 📱 Mobile Optimization

The experience is fully optimized for mobile:
- Touch-friendly interactions
- Responsive UI
- Performance optimizations
- Adaptive rendering quality

## 🌟 Tips for Best Experience

1. **Audio Quality**: Use clear recordings, 128kbps MP3
2. **Letter Length**: Keep messages concise (200-400 words)
3. **Fruit Distribution**: Spread fruits evenly around tree
4. **Unlock Dates**: Use meaningful dates (anniversaries, etc.)
5. **Testing**: Test on both desktop and mobile devices

## 🐛 Troubleshooting

### Audio Not Playing
- Ensure audio files are in `public/audio/`
- Check file paths in letters.json
- Verify audio format is MP3

### Fruits Not Appearing
- Check position coordinates in letters.json
- Ensure `unlocked: true` for immediate access
- Verify letter data structure

### GitHub Pages 404
- Ensure `base` in vite.config.js matches repo name
- Check GitHub Pages settings in repository
- Verify deployment workflow ran successfully

## 📝 License

This project is open source and available under the MIT License.

## 💖 Credits

Created with love using React, Three.js, and modern web technologies.

## 🤝 Contributing

This is a personal romantic project, but feel free to fork it and create your own love tree!

---

**Made with 💕 for someone special**
