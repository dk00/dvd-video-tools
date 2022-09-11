# DVD Video Tools

Convert old DVD videos to play on modern devices.

## Prerequisite

- A working DVD drive
- Python & VapourSynth
- VapourSynth core plugins for deinterlace filters
  - vivtc
  - QTGMC: havsfunc, mvsfunc, avscompact, eddi3m, fmtconv, MVtools, TemporalSoften2, MiscFilters, znedi3

## Usage

- Copy .vob video files from the DVD(LWLibavSource can't read from DVD drives directly)

```
node dvd-video-tool.js copy [path/to/dvd]
```

- Go to path of video files, let the script handle rest

```
cd path-to-video-files
node dvd-video-tool.js
```

**Command Options**

```
Usage: dvd-video-tools [options]

Options:
  -a, --aspect <ratio>      Display/playback aspect ratio, metadata only, does not affect encoding (default: "16:9")
  -d, --deinterlace <mode>  transform interlace video to progressive, options are: none(default), vivtc, qtgmc (default: "none")
  --audio-tracks <number>   number of audio tracks to transcode (default: 1)
  --decimate                remove duplicated frames from deinterlaced video, enabled automatically when using vivtc
  -t <duration>             limit the duration(seconds) of input video
```

## Features

- Convert DVD video into one video file
- High quality deinterlace with QTGMC
- High quality video encoded by x264, with fine-tuned options
- High quality audio with QuickTime AAC
