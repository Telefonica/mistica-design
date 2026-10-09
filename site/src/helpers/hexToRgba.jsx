function hexToRgbA(hex, alpha) {
  if (/^#(?:[A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    var c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");

    if (alpha !== undefined) {
      return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(
        ","
      )},${alpha})`;
    } else {
      return `rgb(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",")})`;
    }
  }

  throw new Error("Bad Hex");
}

export default hexToRgbA;
