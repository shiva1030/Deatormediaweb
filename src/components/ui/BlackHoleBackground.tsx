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
    let mouse = { x: w / 2, y: h / 2, isActive: false };

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    const handleMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.isActive = true; };
    const handleMouseLeave = () => { mouse.isActive = false; };
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    // --- Draw deep space nebula background once ---
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = w; bgCanvas.height = h;
    const bgCtx = bgCanvas.getContext('2d')!;

    // Deep space base
    bgCtx.fillStyle = '#020408';
    bgCtx.fillRect(0, 0, w, h);

    // Subtle nebula blobs
    const nebulas = [
      { x: w * 0.2, y: h * 0.3, r: 300, color: 'rgba(60, 0, 80, 0.07)' },
      { x: w * 0.8, y: h * 0.6, r: 250, color: 'rgba(0, 20, 80, 0.07)' },
      { x: w * 0.5, y: h * 0.8, r: 200, color: 'rgba(80, 0, 30, 0.06)' },
      { x: w * 0.1, y: h * 0.8, r: 180, color: 'rgba(0, 40, 80, 0.05)' },
      { x: w * 0.9, y: h * 0.2, r: 220, color: 'rgba(60, 10, 50, 0.06)' },
    ];
    nebulas.forEach(n => {
      const g = bgCtx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      g.addColorStop(0, n.color);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      bgCtx.beginPath();
      bgCtx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      bgCtx.fillStyle = g;
      bgCtx.fill();
    });

    // --- Star class with twinkle/glow ---
    class Star {
      x: number; y: number; vx: number; vy: number;
      baseRadius: number; radius: number;
      baseOpacity: number; opacity: number;
      color: string; twinkleSpeed: number; twinklePhase: number;
      glows: boolean;

      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.baseRadius = Math.random() * 1.5 + 0.3;
        this.radius = this.baseRadius;
        this.baseOpacity = Math.random() * 0.5 + 0.3;
        this.opacity = this.baseOpacity;
        this.twinkleSpeed = Math.random() * 0.03 + 0.01;
        this.twinklePhase = Math.random() * Math.PI * 2;
        // Most stars are white/blue-white; some have theme tint
        const r = Math.random();
        if (r > 0.85) {
          // Theme pink-red tint
          this.color = `255, 120, 150`;
        } else if (r > 0.7) {
          // Blue-white
          this.color = `180, 210, 255`;
        } else {
          // Pure white
          this.color = `255, 255, 255`;
        }
        this.glows = Math.random() > 0.75; // 25% of stars glow
      }

      update(time: number) {
        // Twinkle: radius and opacity oscillate
        const twinkle = Math.sin(time * this.twinkleSpeed + this.twinklePhase);
        this.radius = this.baseRadius + twinkle * this.baseRadius * 0.5;
        this.opacity = this.baseOpacity + twinkle * 0.15;

        // Gravity pull
        const dx = mouse.x - this.x;
        const rect = canvas?.getBoundingClientRect();
        const relY = mouse.y - (rect?.top || 0);
        const dy = relY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxD = 700;
        const force = Math.max(0, (maxD - dist) / maxD);

        if (mouse.isActive && dist < maxD) {
          const fx = dx / dist; const fy = dy / dist;
          // Strong gravity + stronger swirl so stars orbit wide before spiraling in
          this.vx += fx * force * 1.5 + fy * force * 1.2;
          this.vy += fy * force * 1.5 - fx * force * 1.2;
        } else {
          this.vx *= 0.97; this.vy *= 0.97;
          this.vx += (Math.random() - 0.5) * 0.05;
          this.vy += (Math.random() - 0.5) * 0.05;
        }

        const sp = Math.sqrt(this.vx ** 2 + this.vy ** 2);
        const maxSp = mouse.isActive && dist < maxD ? 7 : 0.8;
        if (sp > maxSp) { this.vx = (this.vx / sp) * maxSp; this.vy = (this.vy / sp) * maxSp; }
        this.x += this.vx; this.y += this.vy;

        // Consume star only when it gets within 80px (wider orbit before disappearing)
        if (mouse.isActive && dist < 80) {
          this.x = Math.random() > 0.5 ? 0 : w;
          this.y = Math.random() * h;
          this.vx = (Math.random() - 0.5) * 0.8;
          this.vy = (Math.random() - 0.5) * 0.8;
        }
        if (this.x < 0) this.x = w; if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h; if (this.y > h) this.y = 0;
      }

      draw() {
        const op = Math.max(0, Math.min(1, this.opacity));

        if (this.glows) {
          // Soft outer glow
          const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 4);
          glow.addColorStop(0, `rgba(${this.color}, ${op * 0.4})`);
          glow.addColorStop(1, `rgba(${this.color}, 0)`);
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
          ctx.closePath();
        }

        // Star core
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.2, this.radius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${op})`;
        ctx.fill();
        ctx.closePath();
      }
    }

    const stars = Array.from({ length: 450 }, () => new Star());

    let animId: number;
    let time = 0;
    const animate = () => {
      time++;

      // Draw static bg
      ctx.drawImage(bgCanvas, 0, 0);

      // Dim overlay for motion trails
      ctx.fillStyle = 'rgba(2, 4, 8, 0.3)';
      ctx.fillRect(0, 0, w, h);

      // ---- Draw accretion disk black hole at mouse ----
      if (mouse.isActive) {
        const rect = canvas?.getBoundingClientRect();
        const relY = mouse.y - (rect?.top || 0);
        const mx = mouse.x;
        const my = relY;
        const R = 22; // event horizon radius

        // 1. Large outer glow halo
        const outerGlow = ctx.createRadialGradient(mx, my, R, mx, my, R * 10);
        outerGlow.addColorStop(0, 'hsla(346, 90%, 55%, 0.35)');
        outerGlow.addColorStop(0.3, 'hsla(346, 80%, 45%, 0.12)');
        outerGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(mx, my, R * 10, 0, Math.PI * 2);
        ctx.fillStyle = outerGlow;
        ctx.fill();
        ctx.closePath();

        // 2. Accretion disk — glowing elliptical rings (bottom / front)
        const diskW = R * 3.5;
        const diskH = R * 0.55;
        for (let i = 6; i >= 0; i--) {
          const p = i / 6;
          const rx = diskW * (0.5 + p * 0.5);
          const ry = diskH * (0.5 + p * 0.5);
          const alpha = (1 - p) * 0.7 + 0.1;

          const dg = ctx.createLinearGradient(mx - rx, my, mx + rx, my);
          dg.addColorStop(0,    `rgba(180, 40,   0,  ${alpha * 0.4})`);
          dg.addColorStop(0.2,  `rgba(255, 110,  15, ${alpha * 0.85})`);
          dg.addColorStop(0.45, `rgba(255, 190,  70, ${alpha})`);
          dg.addColorStop(0.5,  `rgba(255, 230, 140, ${alpha * 1.2})`);
          dg.addColorStop(0.55, `rgba(255, 190,  70, ${alpha})`);
          dg.addColorStop(0.8,  `rgba(255, 110,  15, ${alpha * 0.85})`);
          dg.addColorStop(1,    `rgba(180, 40,   0,  ${alpha * 0.4})`);

          // Front arc (below center)
          ctx.save();
          ctx.beginPath();
          ctx.rect(mx - rx - 2, my, rx * 2 + 4, ry * 3);
          ctx.clip();
          ctx.beginPath();
          ctx.ellipse(mx, my, rx, ry, 0, 0, Math.PI * 2);
          ctx.strokeStyle = dg;
          ctx.lineWidth = ry * 0.5 + 1;
          ctx.stroke();
          ctx.restore();

          // Back arc (top — gravitational lensing)
          ctx.save();
          ctx.beginPath();
          ctx.rect(mx - rx - 2, my - ry * 3, rx * 2 + 4, ry * 3);
          ctx.clip();
          ctx.beginPath();
          ctx.ellipse(mx, my, rx * 0.9, ry * 0.7, 0, Math.PI, 0, true);
          ctx.strokeStyle = dg;
          ctx.lineWidth = (ry * 0.3 + 1) * (1 - p * 0.5);
          ctx.globalAlpha = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.restore();
        }

        // 3. Photon ring — thin bright ring just outside event horizon
        const pr = ctx.createRadialGradient(mx, my, R - 2, mx, my, R + 6);
        pr.addColorStop(0, 'rgba(255, 220, 100, 0)');
        pr.addColorStop(0.5, 'rgba(255, 200, 80, 0.9)');
        pr.addColorStop(1, 'rgba(255, 120, 20, 0)');
        ctx.beginPath();
        ctx.arc(mx, my, R + 3, 0, Math.PI * 2);
        ctx.strokeStyle = pr;
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.closePath();

        // 4. Pure black event horizon
        ctx.beginPath();
        ctx.arc(mx, my, R, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.closePath();
      }

      stars.forEach(s => { s.update(time); s.draw(); });
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full pointer-events-none" />;
};

export default BlackHoleBackground;
