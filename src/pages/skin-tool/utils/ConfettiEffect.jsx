// Confetti animation component with physics and sequins

import { skinVars } from "@telefonica/mistica";
import { useRef, useEffect } from "react";

const ConfettiEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Configuration
    const confettiCount = 50;
    const sequinCount = 10;
    const gravityConfetti = 0.3;
    const gravitySequins = 0.55;
    const dragConfetti = 0.075;
    const dragSequins = 0.02;
    const terminalVelocity = 3;

    // Arrays to store particles
    let confetti = [];
    let sequins = [];

    // Colors with front and back sides
    const colors = [
      { front: "#EAC344", back: "#EAC344" },
      { front: "#C466EF", back: "#C466EF" },
      { front: "#E66C64", back: "#E66C64" },
      {
        front: "#59C2C9",
        back: "#59C2C9",
      },
      { front: "#0066FF", back: "#0066FF" },
    ];

    // Helper functions
    const randomRange = (min, max) => Math.random() * (max - min) + min;

    const initConfettoVelocity = (xRange, yRange) => {
      const x = randomRange(xRange[0], xRange[1]);
      const range = yRange[1] - yRange[0] + 1;
      let y =
        yRange[1] -
        Math.abs(randomRange(0, range) + randomRange(0, range) - range);
      if (y >= yRange[1] - 1) {
        y += Math.random() < 0.25 ? randomRange(1, 3) : 0;
      }
      return { x: x, y: -y };
    };

    // Confetto Class
    function Confetto() {
      this.randomModifier = randomRange(0, 99);
      this.color = colors[Math.floor(randomRange(0, colors.length))];
      this.dimensions = {
        x: randomRange(5, 9),
        y: randomRange(8, 15),
      };
      this.position = {
        x: randomRange(canvas.width / 2 - 300, canvas.width / 2 + 300),
        y: randomRange(canvas.height / 2 - 150, canvas.height / 2 + 150),
      };
      this.rotation = randomRange(0, 2 * Math.PI);
      this.scale = { x: 1, y: 1 };
      this.velocity = initConfettoVelocity([-9, 9], [6, 11]);
    }

    Confetto.prototype.update = function () {
      this.velocity.x -= this.velocity.x * dragConfetti;
      this.velocity.y = Math.min(
        this.velocity.y + gravityConfetti,
        terminalVelocity
      );
      this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09);
    };

    // Sequin Class
    function Sequin() {
      this.color = colors[Math.floor(randomRange(0, colors.length))].back;
      this.radius = randomRange(1, 2);
      this.position = {
        x: randomRange(canvas.width / 2 - 100, canvas.width / 2 + 100),
        y: randomRange(canvas.height / 2 - 50, canvas.height / 2 + 50),
      };
      this.velocity = {
        x: randomRange(-6, 6),
        y: randomRange(-8, -12),
      };
    }

    Sequin.prototype.update = function () {
      this.velocity.x -= this.velocity.x * dragSequins;
      this.velocity.y = this.velocity.y + gravitySequins;

      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    };

    // Initialize particles
    const initBurst = () => {
      for (let i = 0; i < confettiCount; i++) {
        confetti.push(new Confetto());
      }
      for (let i = 0; i < sequinCount; i++) {
        sequins.push(new Sequin());
      }
    };

    // Track animation start time
    const startTime = Date.now();
    const totalDuration = 4000; // 10 seconds
    const fadeOutDuration = 2000; // 2 seconds fade out

    // Render function
    const render = () => {
      const elapsedTime = Date.now() - startTime;
      const opacity =
        elapsedTime > totalDuration - fadeOutDuration
          ? 1 -
            (elapsedTime - (totalDuration - fadeOutDuration)) / fadeOutDuration
          : 1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = Math.max(0, Math.min(1, opacity)); // Ensure opacity stays between 0 and 1

      confetti.forEach((confetto, index) => {
        let width = confetto.dimensions.x * confetto.scale.x;
        let height = confetto.dimensions.y * confetto.scale.y;

        ctx.translate(confetto.position.x, confetto.position.y);
        ctx.rotate(confetto.rotation);

        confetto.update();

        ctx.fillStyle =
          confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;
        ctx.fillRect(-width / 2, -height / 2, width, height);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
      });

      sequins.forEach((sequin, index) => {
        ctx.translate(sequin.position.x, sequin.position.y);

        sequin.update();

        ctx.fillStyle = sequin.color;
        ctx.beginPath();
        ctx.arc(0, 0, sequin.radius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.setTransform(1, 0, 0, 1, 0, 0);
      });

      confetti = confetti.filter(
        (confetto) => confetto.position.y < canvas.height
      );
      sequins = sequins.filter((sequin) => sequin.position.y < canvas.height);

      if (elapsedTime < totalDuration) {
        window.requestAnimationFrame(render);
      }
    };

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    initBurst();
    render();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", zIndex: 9999 }} />;
};

export default ConfettiEffect;
