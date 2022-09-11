const deint0 =
  'def deint(clip):\n' +
  '  import havsfunc as haf\n' +
  `  r = haf.QTGMC(clip, Preset='Medium', TFF=True)\n` +
  '  return r'

const deintVivtc =
  'def deint(r):\n' +
  '  r = vs.core.vivtc.VFM(r, order=1)\n' +
  '  return vs.core.vivtc.VDecimate(r, cycle=5)'

const decimate =
  'def decimate(r):\n' +
  `  r = vs.core.vivtc.VDecimate(r, cycle=2)\n` +
  '  return vs.core.vivtc.VDecimate(r, cycle=5)'

const denoise =
  'def denoise(r):\n' +
  '  s = c.mv.Super(r, pel=2, sharp=2)\n' +
  '  bv2 = c.mv.Analyse(s, search=5, isb=True, delta=2, overlap=4, dct=5)\n' +
  '  bv1 = c.mv.Analyse(s, search=5, isb=True, delta=1, overlap=4, dct=5)\n' +
  '  fv1 = c.mv.Analyse(s, search=5, isb=False, delta=1, overlap=4, dct=5)\n' +
  '  fv2 = c.mv.Analyse(s, search=5, isb=False, delta=2, overlap=4, dct=5)\n' +
  '  return c.mv.Degrain2(r, s, bv1, fv1, bv2, fv2, thsad=800)'
const head = 'import vapoursynth as vs'
const foot = 'o.set_output()'

const gen = ({sources, parts, meta}) => {
  let used, load, stream, b
  used = {}
  load =
    'source = ' +
    sources
      .map(function ({path}) {
        let s, that
        s = "vs.core.lsmas.LWLibavSource(r'" + path + "', threads=1)"
        if (meta.deinterlace) s = 'deint(' + s + ')'
        if (meta.decimate) s = `decimate(${s})`
        if ((that = meta.crop))
          s =
            'vs.core.std.CropRel(' +
            s +
            ', ' +
            that.left +
            ', ' +
            that.right +
            ')'
        return s
      })
      .join(' + ')

  stream = (it => 'o = ' + it)(
    parts
      .map(({start, end}) => {
        return `vs.core.std.Trim(source, ${[start, end]
          .filter(Boolean)
          .join(', ')})`
      })
      .join(' + ') || 'source'
  )

  b = [head, load, stream, foot]
  if (meta.decimate || meta.deinterlace === 'vivtc') b.unshift(decimate)
  if (meta.deinterlace === 'vivtc') b.unshift(deintVivtc)
  else if (meta.deinterlace) b.unshift(deint0)
  if (meta.denoise) b.unshift(denoise)
  if (meta.bitdepth === 10) b.unshift('o = c.fmtc.bitdepth(o, bits=10, dmode=0)')
  return b.join('\n')
}

module.exports = gen
