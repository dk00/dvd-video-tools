const runSequential = tasks => 
  tasks.reduce(async (last, run) => {
    await last
    return run()
  }, Promise.resolve())

const main = async () => {
  const name = 'Thomas Friends the Great Discovery'
  const dvdRoot = 'f:/VIDEO_TS'
  const fs = require('fs').promises
  const files = await fs.readdir(dvdRoot)

  runSequential(
    files.filter(slicePath => /VTS_0[0-9]_[0-9]|\.ifo$/i.test(slicePath))
    .map(path => () => {
      console.log(`cp ${dvdRoot}/${path} -> ./${path}`)
      return fs.copyFile(`${dvdRoot}/${path}`, `./${path}`)
    })
  )
}

main()
