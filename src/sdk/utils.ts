const bin2hex = (s: string) => {
  let i,
    l,
    o = "",
    n;

  s += "";

  for (i = 0, l = s.length; i < l; i++) {
    n = s.charCodeAt(i).toString(16);
    o += n.length < 2 ? "0" + n : n;
  }

  return o;
};

export const getDeviceID = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const txt = "uuid";
  ctx.textBaseline = "top";
  ctx.font = "12px 'Arial'";
  ctx.fillStyle = "#000";
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = "#F00";
  ctx.fillText(txt, 2, 15);
  ctx.fillStyle = "#0F0";
  ctx.fillText(txt, 4, 17);

  const b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
  const bin = atob(b64);
  const crc = bin2hex(bin.slice(-16, -12));
  return crc;
};

const upperStr = Array(26)
  .fill(65 /** A */)
  .map((e, i) => String.fromCharCode(e + i))
  .join("");
const lowerStr = upperStr.toLowerCase();
const numberStr = Array(10)
  .fill(0)
  .map((_, i) => i)
  .join("");
const seedStr = upperStr + lowerStr + numberStr;

export const generateID = (len: number) =>
  seedStr
    .split("")
    .sort(() => Math.random() - 0.5)
    .slice(0, len)
    .join("");

/**
 * uid 没接登陆，设置为随机id
 * @returns
 */
export const getUserID = () => {
  return generateID(6);
};
