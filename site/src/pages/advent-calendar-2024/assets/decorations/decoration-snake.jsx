import { skinVars } from "@telefonica/mistica";
import Lottie from "lottie-react";
import { useLayoutEffect, useMemo } from "react";

const DecorationSnake = ({ width = 300, color = skinVars.colors.brand }) => {
  useLayoutEffect(() => {
    const styles = `
      .snake-animation path {
        fill: ${color};
        stroke: ${color};
      }
    `;

    if (typeof document !== "undefined") {
      const styleTag = document.createElement("style");
      styleTag.textContent = styles;
      document.head.appendChild(styleTag);
    }
  }, [color]);

  const lottieElement = useMemo(
    () => (
      <Lottie
        className="snake-animation" // Clase para aplicar estilos
        animationData={{
          v: "5.9.0",
          fr: 60,
          ip: 0,
          op: 161,
          w: 300,
          h: 32,
          nm: "Comp 1",
          ddd: 0,
          assets: [],
          layers: [
            {
              ddd: 0,
              ind: 2,
              ty: 4,
              nm: "Shape Layer 3",
              sr: 1,
              ks: {
                o: { a: 0, k: 100, ix: 11 },
                r: { a: 0, k: 0, ix: 10 },
                p: {
                  a: 1,
                  k: [
                    {
                      i: { x: 0.833, y: 0.833 },
                      o: { x: 0.167, y: 0.167 },
                      t: 0,
                      s: [2.75, 16, 0],
                      to: [0, 0, 0],
                      ti: [0, 0, 0],
                    },
                    { t: 781, s: [298.25, 16, 0] },
                  ],
                  ix: 2,
                  l: 2,
                },
                a: { a: 0, k: [0, 0, 0], ix: 1, l: 2 },
                s: { a: 0, k: [100, 100, 100], ix: 6, l: 2 },
              },
              ao: 0,
              shapes: [
                {
                  ind: 0,
                  ty: "sh",
                  ix: 1,
                  ks: {
                    a: 0,
                    k: {
                      i: [
                        [0, 0],
                        [-15.261, 0],
                        [-15.261, 0],
                        [-15.262, 0],
                        [-15.263, 0],
                        [-15.262, 0],
                        [-15.263, 0],
                        [-15.262, 0],
                        [-15.262, 0],
                        [-15.263, 0],
                        [-15.263, 0],
                        [-15.26, 0],
                        [-15.262, 0],
                        [-15.262, 0],
                        [-15.264, 0],
                        [-15.264, 0],
                        [-15.265, 0],
                        [-15.264, 0],
                        [-15.267, 0],
                        [-15.267, 0],
                      ],
                      o: [
                        [15.261, 0],
                        [15.261, 0],
                        [15.262, 0],
                        [15.263, 0],
                        [15.262, 0],
                        [15.263, 0],
                        [15.262, 0],
                        [15.262, 0],
                        [15.263, 0],
                        [15.263, 0],
                        [15.26, 0],
                        [15.262, 0],
                        [15.262, 0],
                        [15.264, 0],
                        [15.264, 0],
                        [15.265, 0],
                        [15.265, 0],
                        [15.267, 0],
                        [15.267, 0],
                        [0, 0],
                      ],
                      v: [
                        [-289.997, -11.906],
                        [-259.476, 11.906],
                        [-228.954, -11.906],
                        [-198.43, 11.906],
                        [-167.904, -11.906],
                        [-137.38, 11.906],
                        [-106.855, -11.906],
                        [-76.331, 11.906],
                        [-45.806, -11.906],
                        [-15.281, 11.906],
                        [15.246, -11.906],
                        [45.766, 11.906],
                        [76.29, -11.906],
                        [106.815, 11.906],
                        [137.343, -11.906],
                        [167.871, 11.906],
                        [198.401, -11.906],
                        [228.93, 11.906],
                        [259.464, -11.906],
                        [289.997, 11.906],
                      ],
                      c: false,
                    },
                    ix: 2,
                  },
                  nm: "Path 1",
                  mn: "ADBE Vector Shape - Group",
                  hd: false,
                },
                {
                  ty: "tm",
                  s: {
                    a: 1,
                    k: [
                      {
                        i: { x: [0.833], y: [0.833] },
                        o: { x: [0.167], y: [0.167] },
                        t: 0,
                        s: [50],
                      },
                      { t: 781, s: [0] },
                    ],
                    ix: 1,
                  },
                  e: {
                    a: 1,
                    k: [
                      {
                        i: { x: [0.833], y: [0.833] },
                        o: { x: [0.167], y: [0.167] },
                        t: 0,
                        s: [100],
                      },
                      { t: 781, s: [50] },
                    ],
                    ix: 2,
                  },
                  o: { a: 0, k: 0, ix: 3 },
                  m: 1,
                  ix: 2,
                  nm: "Trim Paths 1",
                  mn: "ADBE Vector Filter - Trim",
                  hd: false,
                },
                {
                  ty: "st",
                  c: { a: 0, k: [0, 0.4, 1, 1], ix: 3 },
                  o: { a: 0, k: 100, ix: 4 },
                  w: { a: 0, k: 2, ix: 5 },
                  lc: 2,
                  lj: 1,
                  ml: 4,
                  bm: 0,
                  nm: "snake",
                  mn: "ADBE Vector Graphic - Stroke",
                  hd: false,
                },
              ],
              ip: 0,
              op: 901,
              st: 0,
              bm: 0,
            },
          ],
          markers: [],
        }}
      />
    ),
    []
  );

  return <div style={{ width: width }}>{lottieElement}</div>;
};

export default DecorationSnake;
