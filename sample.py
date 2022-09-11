import vapoursynth as vs

def deint(r):
  r = vs.core.vivtc.VFM(r, order=1)
  return vs.core.vivtc.VDecimate(r, cycle=5)


path0 = f'I:\\x\\2209\\VTS_01_0.VOB'
path1 = f'f:\\VIDEO_TS\\VTS_01_1.VOB'

source = deint(vs.core.lsmas.LWLibavSource(path0, threads=1))
o = source
o.set_output()