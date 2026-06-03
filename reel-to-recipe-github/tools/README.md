# Bundled Video Analysis Tools

Whisk uses local tools for downloading public platform videos, retrieving public YouTube captions, and sampling visual frames without a paid service.

The binaries are not committed to this GitHub-friendly copy because each one is larger than GitHub's normal file-size limit. Run this after cloning:

```bash
npm run setup:tools
```

## yt-dlp

- Binary: `yt-dlp_macos`
- Downloaded from: `https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos`
- Version included: `2026.03.17`
- Standalone executable license: [GPLv3+](https://github.com/yt-dlp/yt-dlp/blob/master/README.md#licensing)

Set `YT_DLP_PATH` to override the bundled helper.

## FFmpeg

- Binary: `ffmpeg`
- Downloaded from: `https://evermeet.cx/ffmpeg/getrelease/zip`
- Version included: `8.1.1-tessus`
- Distribution link: [FFmpeg's macOS download section](https://ffmpeg.org/download.html#build-mac)
- License: [GPL](https://ffmpeg.org/legal.html)

Set `FFMPEG_PATH` to override the bundled frame extractor.
