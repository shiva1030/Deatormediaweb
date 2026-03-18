import React, { useEffect, useRef } from 'react';

const BlackHoleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    // Black hole sits at center-right of hero
    let bx = w * 0.72;
    let by = h * 0.5;

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      bx = w * 0.72;
      by = h * 0.5;
    };
    window.addEventListener('resize', handleResize);

    // --- Stars ---
    class Star {
      x = Math.random() * w;
      y = Math.random() * h;
      vx = (Math.random() - 0.5) * 0.3;
      vy = (Math.random() - 0.5) * 0.3;
      radius = Math.random() * 1.4 + 0.2;
      opacity = Math.random() * 0.6 + 0.3;
      twinklePhase = Math.random() * Math.PI * 2;
      twinkleSpeed = Math.random() * 0.02 + 0.005;
      color = Math.random() > 0.8 ? '255, 200, 180' : Math.random() > 0.5 ? '200, 220, 255' : '255,255,255';

      update(t: number) {
        // Gravitational lensing pull toward black hole
        const dx = bx - this.x;
        const dy = by - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxD = 700;
        const force = Math.max(0, (maxD - dist) / maxD);

        if (dist < maxD && dist > 60) {
          const fx = dx / dist; const fy = dy / dist;
          this.vx += fx * force * force * 0.6 + fy * force * 0.25;
          this.vy += fy * force * force * 0.6 - fx * force * 0.25;
        }
        this.vx *= 0.98; this.vy *= 0.98;

        const sp = Math.sqrt(this.vx ** 2 + this.vy ** 2);
        const maxSp = dist < maxD ? 4 : 0.6;
        if (sp > maxSp) { this.vx = (this.vx / sp) * maxSp; this.vy = (this.vy / sp) * maxSp; }
        this.x += this.vx; this.y += this.vy;

        // Consumed by black hole — respawn at edge
        if (dist < 55) {
          this.x = Math.random() * w;
          this.y = Math.random() > 0.5 ? 0 : h;
          this.vx = 0; this.vy = 0;
        }
        if (this.x < 0) this.x = w; if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h; if (this.y > h) this.y = 0;

        this.opacity = 0.35 + 0.3 * Math.sin(t * this.twinkleSpeed + this.twinklePhase);
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
        ctx.closePath();
      }
    }

    const stars = Array.from({ length: 380 }, () => new Star());

    // ---------- Black hole drawing ----------
    function drawBlackHole(t: number) {
      const R = Math.min(w, h) * 0.18; // Event horizon radius
      const diskRx = R * 2.8;          // Disk horizontal radius
      const diskRyBase = R * 0.28;     // Disk vertical radius (thin)

      // --- Outer accretion disk (below — front) ---
      for (let i = 12; i >= 0; i--) {
        const progress = i / 12; // 0 = inner, 1 = outer
        const rx = diskRx * (0.5 + progress * 0.5);
        const ry = diskRyBase * (0.4 + progress * 0.6);
        const alpha = (1 - progress) * 0.55 + 0.05;

        const diskGrad = ctx.createLinearGradient(bx - rx, by, bx + rx, by);
        // Interstellar-style orange/amber/red gradient
        diskGrad.addColorStop(0,   `rgba(180, 40, 0,   ${alpha * 0.5})`);
        diskGrad.addColorStop(0.2, `rgba(255, 100, 10, ${alpha * 0.9})`);
        diskGrad.addColorStop(0.45,`rgba(255, 180, 60, ${alpha})`);
        diskGrad.addColorStop(0.5, `rgba(255, 220, 120,${alpha * 1.1})`);
        diskGrad.addColorStop(0.55,`rgba(255, 180, 60, ${alpha})`);
        diskGrad.addColorStop(0.8, `rgba(255, 100, 10, ${alpha * 0.9})`);
        diskGrad.addColorStop(1,   `rgba(180, 40, 0,   ${alpha * 0.5})`);

        ctx.save();
        ctx.beginPath();
        // Only draw BELOW the black hole center (front disk)
        ctx.rect(bx - rx - 5, by, rx * 2 + 10, ry * 3 + 5);
        ctx.clip();
        ctx.beginPath();
        ctx.ellipse(bx, by, rx, ry * (1 + progress * 0.3), 0, 0, Math.PI * 2);
        ctx.strokeStyle = diskGrad;
        ctx.lineWidth = ry * 0.55 + 1;
        ctx.stroke();
        ctx.restore();
      }

      // --- Top arc: gravitational lensing (disk bends over top) ---
      // In reality, light from the back of the disk bends over the BH and appears above it
      for (let i = 8; i >= 0; i--) {
        const progress = i / 8;
        const rx = diskRx * (0.35 + progress * 0.4);
        const ry = R * (0.3 + progress * 0.5);
        const alpha = (1 - progress) * 0.4 + 0.05;

        const topGrad = ctx.createLinearGradient(bx - rx, by - ry, bx + rx, by - ry);
        topGrad.addColorStop(0,   `rgba(160, 30, 0,   ${alpha * 0.4})`);
        topGrad.addColorStop(0.25,`rgba(240, 80, 10,  ${alpha * 0.8})`);
        topGrad.addColorStop(0.5, `rgba(255, 160, 50, ${alpha})`);
        topGrad.addColorStop(0.75,`rgba(240, 80, 10,  ${alpha * 0.8})`);
        topGrad.addColorStop(1,   `rgba(160, 30, 0,   ${alpha * 0.4})`);

        ctx.save();
        ctx.beginPath();
        // Only draw ABOVE the black hole center
        ctx.rect(bx - rx - 5, by - ry * 2 - 5, rx * 2 + 10, ry * 2 + 5);
        ctx.clip();
        ctx.beginPath();
        ctx.ellipse(bx, by, rx, ry, 0, Math.PI, 0, true); // upper arc only
        ctx.strokeStyle = topGrad;
        ctx.lineWidth = 4 + (1 - progress) * 6;
        ctx.stroke();
        ctx.restore();
      }

      // --- Photon ring (thin bright ring just outside event horizon) ---
      const photonR = R * 1.08;
      const photonGrad = ctx.createRadialGradient(bx, by, photonR - 3, bx, by, photonR + 4);
      photonGrad.addColorStop(0, 'rgba(255, 220, 120, 0.0)');
      photonGrad.addColorStop(0.4, 'rgba(255, 200, 80, 0.7)');
      photonGrad.addColorStop(0.7, 'rgba(255, 160, 40, 0.4)');
      photonGrad.addColorStop(1, 'rgba(255, 100, 0, 0.0)');
      ctx.beginPath();
      ctx.arc(bx, by, photonR, 0, Math.PI * 2);
      ctx.strokeStyle = photonGrad;
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.closePath();

      // --- Event horizon: pure black circle ---
      ctx.beginPath();
      ctx.arc(bx, by, R, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();
      ctx.closePath();

      // --- Outer gravitational lensing glow (ambient light bending) ---
      const lensGlow = ctx.createRadialGradient(bx, by, R, bx, by, R * 3.5);
      lensGlow.addColorStop(0, 'rgba(255, 120, 20, 0.10)');
      lensGlow.addColorStop(0.3, 'rgba(200, 60, 10, 0.05)');
      lensGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(bx, by, R * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = lensGlow;
      ctx.fill();
      ctx.closePath();

      // --- Doppler brightening: bright hot spot on one side (rotation effect) ---
      const hotSpotAngle = t * 0.003; // rotate slowly
      const hsx = bx + Math.cos(hotSpotAngle) * diskRx * 0.7;
      const hsy = by + Math.sin(hotSpotAngle) * diskRyBase * 0.4;
      const hotGrad = ctx.createRadialGradient(hsx, hsy, 0, hsx, hsy, diskRx * 0.4);
      hotGrad.addColorStop(0, 'rgba(255, 230, 140, 0.18)');
      hotGrad.addColorStop(0.5, 'rgba(255, 120, 30, 0.06)');
      hotGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(hsx, hsy, diskRx * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = hotGrad;
      ctx.fill();
      ctx.closePath();
    }

    let animId: number;
    let t = 0;

    const animate = () => {
      t++;

      // Deep space background
      ctx.fillStyle = '#010205';
      ctx.fillRect(0, 0, w, h);

      // Subtle nebula background
      const nebula = ctx.createRadialGradient(bx, by, 0, bx, by, Math.max(w, h));
      nebula.addColorStop(0, 'rgba(30,5,0,0.4)');
      nebula.addColorStop(0.3, 'rgba(10,0,5,0.2)');
      nebula.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.rect(0, 0, w, h);
      ctx.fillStyle = nebula;
      ctx.fill();

      // Stars
      stars.forEach(s => { s.update(t); s.draw(); });

      // Black hole
      drawBlackHole(t);

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full pointer-events-none" />;
};

export default BlackHoleBackground;
