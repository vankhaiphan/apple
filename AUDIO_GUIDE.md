# Audio Guidelines

## Recording Your Love Letters

### Equipment
- **Microphone**: Use a decent quality microphone (phone mic is okay)
- **Environment**: Record in a quiet room with minimal echo
- **Distance**: Stay about 6-12 inches from the microphone

### Recording Tips
1. **Speak naturally** - Talk as if you're speaking directly to them
2. **Pace yourself** - Don't rush, let emotions flow naturally
3. **Add pauses** - Natural pauses make it feel more intimate
4. **Show emotion** - Let your feelings come through in your voice
5. **Keep it concise** - 1-3 minutes per letter is ideal

### Technical Settings
- **Sample Rate**: 44.1kHz or 48kHz
- **Bit Rate**: 128kbps MP3 (good balance of quality and file size)
- **Mono vs Stereo**: Mono is fine for voice
- **Format**: MP3 (best browser compatibility)

### Editing Your Audio

#### Using Free Software (Audacity)
1. Download [Audacity](https://www.audacityteam.org/)
2. Import your recording
3. Remove silence at start/end
4. Normalize volume (Effect > Normalize)
5. Remove background noise if needed
6. Export as MP3

#### Using Online Tools
- [TwistedWave Online](https://twistedwave.com/online)
- [Audio Trimmer](https://audiotrimmer.com/)
- [Online Audio Converter](https://online-audio-converter.com/)

### File Naming
Use consistent naming:
```
letter-001.mp3
letter-002.mp3
letter-003.mp3
```

### File Size Guidelines
- **Target**: 1-3 MB per file
- **Maximum**: 5 MB per file
- **Total**: Keep total under 50 MB for best performance

### Export Settings (Audacity)
1. File > Export > Export as MP3
2. Bit Rate Mode: Constant
3. Quality: 128 kbps
4. Channel Mode: Mono (or Stereo if preferred)
5. Click OK

### Placeholder Audio
If you don't have audio files yet, you can:
1. Use text-to-speech tools temporarily
2. Record simple placeholder messages
3. The app will work without audio (just display text)

### Sample Scripts

#### For "Memories" Branch
```
"Remember when... [describe memory]
That moment meant so much to me because...
I smile every time I think about..."
```

#### For "Admiration" Branch
```
"One thing I truly admire about you is...
The way you... inspires me to...
You have this incredible ability to..."
```

#### For "Gratitude" Branch
```
"Thank you for...
I don't say it enough, but...
Your... has made such a difference in my life..."
```

#### For "Dreams" Branch
```
"I dream of us...
In the future, I see us...
Together, I believe we can..."
```

#### For "Things I've Never Said" Branch
```
"I've wanted to tell you...
Sometimes I...
You should know that..."
```

### Privacy & Security
- These audio files will be public on GitHub Pages
- Anyone with the URL can access them
- Consider this before recording deeply personal messages
- Alternative: Use a private hosting service or password-protect

### Testing Your Audio
Before deploying:
1. Place audio files in `public/audio/`
2. Update paths in `letters.json`
3. Run `npm run dev`
4. Click on fruits to test playback
5. Check volume levels
6. Test on mobile devices

### Troubleshooting

**Audio won't play:**
- Check file format is MP3
- Verify file path in letters.json
- Ensure file is in public/audio/ folder
- Check browser console for errors

**Volume too low/high:**
- Use Audacity's Normalize effect
- Target -1.0 dB for maximum volume
- Use Amplify effect if needed

**Background noise:**
- Use Audacity's Noise Reduction
- Record in a quieter environment
- Use a pop filter for better quality

**File too large:**
- Lower bit rate to 96kbps or 64kbps
- Convert stereo to mono
- Trim silence at beginning/end

## Alternative: Text-to-Speech

If you prefer not to record:
1. Write your letters in letters.json
2. Remove audioFile references
3. The app will display text only (still beautiful!)
4. Or use TTS services to generate audio:
   - [Natural Reader](https://www.naturalreaders.com/)
   - [TTSMaker](https://ttsmaker.com/)
   - [Murf.ai](https://murf.ai/)

---

**Remember**: The most important thing is the message, not perfect audio quality. Speak from the heart! 💕
