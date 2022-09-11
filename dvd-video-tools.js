const path = require('path')
const encodeVideo = require('./video')
const encodeAudio = require('./audio')
const {shellRun} = require('./utils')

const main = async () => {
  const {program} = require('commander')
  program
    .option(
      '-a, --aspect <ratio>',
      'Display/playback aspect ratio, metadata only, does not affect encoding',
      '16:9'
    )
    .option(
      '-d, --deinterlace <mode>',
      'transform interlace video to progressive, options are: none(default), vivtc, qtgmc',
      'none'
    )
    .option('--audio-tracks <number>', 'number of audio tracks to transcode', 1)
    .option(
      '--decimate',
      'remove duplicated frames from deinterlaced video, enabled automatically when using vivtc'
    )
    .option('-t <duration>', 'limit the duration(seconds) of input video')
    .parse()
  const options = program.opts()

  const fs = require('fs').promises
  const videoFiles = (await fs.readdir('.')).filter(name =>
    /\.vob$/i.test(name)
  )
  await Promise.all([
    encodeVideo(videoFiles, {output: 'out.mp4', ...options}),
    encodeAudio(videoFiles, options),
  ])
  const baseName = path.basename(process.cwd())
  const audioTrackNumbers = Array.from(
    {length: options.audioTracks},
    (_, i) => i
  )
  const audioInput = audioTrackNumbers.map(i => `-i out${i}.m4a`).join(' ')
  const audioMap = audioTrackNumbers.map(i => `-map ${i + 1}:a`).join(' ')
  const muxCommand = `ffmpeg -i out.mp4 ${audioInput} -map 0 ${audioMap} -aspect ${options.aspect} -c:v copy -c:a copy  "../${baseName}.mp4"`
  console.log(muxCommand)

  await shellRun(muxCommand, {stdio: 'inherit'})
}

main()
