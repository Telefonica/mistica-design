// Confetti animation component

import { useRef, useEffect } from "react";

const ConfettiEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const confettiPieces = [];
    const colors = ["#EAC344", "#C466EF", "#E66C64", "#59C2C9", "#0066FF"];
    const confettiCount = 100;

    const createConfettiPiece = () => ({
      x: canvas.width / 2, // Center the confetti to the screen horizontal
      y: canvas.height / 2, // Center the confetti to the screen vertical
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocityX: (Math.random() - 0.5) * 10, // Animation expands on the sides
      velocityY: (Math.random() - 0.8) * 10, // Animation goes up
      rotation: Math.random() * 360,
      opacity: 1,
    });

    for (let i = 0; i < confettiCount; i++) {
      confettiPieces.push(createConfettiPiece());
    }

    const updateConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confettiPieces.forEach((piece, index) => {
        piece.x += piece.velocityX;
        piece.y += piece.velocityY;
        piece.velocityY += 0.2; // Gravity simulation
        piece.rotation += piece.velocityX * 2;
        piece.opacity -= 0.01;

        if (piece.opacity <= 0) {
          confettiPieces.splice(index, 1);
        }

        drawConfettiPiece(piece);
      });

      if (confettiPieces.length > 0) {
        requestAnimationFrame(updateConfetti);
      }
    };

    const drawConfettiPiece = (piece) => {
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate((piece.rotation * Math.PI) / 180);
      ctx.globalAlpha = piece.opacity;
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
      ctx.restore();
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    updateConfetti();

    setTimeout(() => {
      confettiPieces.length = 0;
    }, 3000);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", zIndex: 9999 }}
    />
  );
};

export default ConfettiEffect;
