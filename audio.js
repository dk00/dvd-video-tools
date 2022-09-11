const {shellRun} = require('./utils')

const encodeAudio = (videoFiles, {t: duration, audioTracks} = {}) => {
  const limitDuration = duration > 0 ? `-t ${duration}` : ''
  const sourceCommands = Array.from({length: audioTracks}, (_, i) => i).map(
    trackIndex =>
      `ffmpeg ${limitDuration} -i "concat:${videoFiles.join(
        '|'
      )}" -map 0:a:${trackIndex} -f s16le -acodec pcm_s16le -`
  )

  return Promise.all(
    sourceCommands.map((command, i) => {
      const encodeCommand = `qaac -o out${i}.m4a -R --raw-channels 2 --raw-rate 48000 --raw-format s16L -V 63 -q 2 -r keep --no-delay -`
      console.log(`${command} | ${encodeCommand}`)
      return shellRun(`${command} | ${encodeCommand}`)
    })
  )
}

module.exports = encodeAudio
