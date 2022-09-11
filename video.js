const {shellRun} = require('./utils')

const x264Options =
  '--demuxer y4m --crf 25 -r 16 -b 13 --b-pyramid normal --b-adapt 2 -I infinite --open-gop --rc-lookahead 60 --aq-mode 3 --aq-strength 0.5 --me umh --merange 24 -m 10 --weightp 2 -t 2 --psy-rd 0.0:0.0 -A all --direct auto --non-deterministic --thread-input --ssim'

const encodeVideo = async (videoFiles, {output, t: duration, deinterlace, decimate} = {}) => {
  const vpy = require('./vpy')
  const vpyScript = vpy({
    sources: videoFiles.map(path => ({path})),
    parts: [],
    meta: {deinterlace, decimate},
  })
  const fps = 60
  const limitDudation = duration > 0 ? `-e ${duration * fps}` : ''
  const fs = require('fs').promises
  await fs.writeFile('source.py', vpyScript)
  const encodeCommand = `vspipe source.py - -c y4m ${limitDudation} | x264 -o ${output} - ${x264Options}`
  console.log(encodeCommand)
  return shellRun(encodeCommand, {stdio: 'inherit'})
}

module.exports = encodeVideo
