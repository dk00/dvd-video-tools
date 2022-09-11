const shellRun = (command, options) => {
  const {spawn} = require('child_process')
  const p = spawn(command, {
    shell: true,
    stdio: 'ignore',
    ...options,
  })
  return new Promise((resolve, reject) => {
    p.on('exit', resolve)
  })
}

module.exports = {shellRun}
