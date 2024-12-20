const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
export function parseLyric(lrcStr) {
  const lyricInfos = [];
  const lyricLines = lrcStr.split("\n");
  for (const lineStr of lyricLines) {
    const result = timeReg.exec(lineStr);
    if (!result) continue;
    const minute = result[1] * 60 * 1000;
    const second = result[2] * 1000;
    const mSend = result[3].length === 2 ? result[3] * 10 : result[3] * 1;
    const time = minute + second + mSend;

    const text = lineStr.replace(timeReg, "");
    lyricInfos.push({ time, text });
  }
  return lyricInfos
}
