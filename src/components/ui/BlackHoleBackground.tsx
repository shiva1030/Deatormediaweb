import React, { useEffect, useRef } from 'react';

// --- Planet Types ---
type PlanetType = 'earth' | 'mars' | 'saturn' | 'jupiter' | 'neptune';
const PLANET_TYPES: PlanetType[] = ['earth', 'mars', 'saturn', 'jupiter', 'neptune'];

function drawPlanet(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, type: PlanetType) {
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.05, x, y, r);

  switch (type) {
    case 'earth':
      g.addColorStop(0, '#8bcfff');
      g.addColorStop(0.3, '#3a7bd5');
      g.addColorStop(0.6, '#1a5c22');
      g.addColorStop(0.85, '#2e8b57');
      g.addColorStop(1, '#0a2a4a');
      break;
    case 'mars':
      g.addColorStop(0, '#e87f5a');
      g.addColorStop(0.4, '#c1440e');
      g.addColorStop(0.8, '#8b2500');
      g.addColorStop(1, '#5a1a00');
      break;
    case 'saturn':
      g.addColorStop(0, '#f5deb3');
      g.addColorStop(0.3, '#d4a55a');
      g.addColorStop(0.7, '#c8924a');
      g.addColorStop(1, '#8b5e3c');
      break;
    case 'jupiter':
      g.addColorStop(0, '#e8c87a');
      g.addColorStop(0.25, '#c19a4a');
      g.addColorStop(0.5, '#8b6914');
      g.addColorStop(0.75, '#a0522d');
      g.addColorStop(1, '#6b3d12');
      break;
    case 'neptune':
      g.addColorStop(0, '#5bc8f5');
      g.addColorStop(0.4, '#1a6ab5');
      g.addColorStop(0.8, '#0a2a8a');
      g.addColorStop(1, '#050a3a');
      break;
  }

  // Draw sphere
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.closePath();

  // Saturn rings
  if (type === 'saturn') {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, 0.35);
    ctx.beginPath();
    ctx.arc(0, 0, r * 2.1, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(210, 180, 120, 0.6)';
    ctx.lineWidth = r * 0.45;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.55, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(180, 140, 80, 0.3)';
    ctx.lineWidth = r * 0.15;
    ctx.stroke();
    ctx.restore();
    // Redraw planet on top of rings
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.closePath();
  }

  // Jupiter bands
  if (type === 'jupiter') {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.clip();
    const bands = ['rgba(200,140,80,0.4)', 'rgba(160,90,30,0.35)', 'rgba(220,160,100,0.3)', 'rgba(140,70,20,0.4)'];
    const bh = (r * 2) / bands.length;
    bands.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(x - r, y - r + i * bh, r * 2, bh * 0.6);
    });
    ctx.restore();
  }

  // Atmosphere glow
  const glowMap: Record<PlanetType, string> = {
    earth: 'rgba(60,120,255,0.15)',
    mars: 'rgba(200,80,30,0.12)',
    saturn: 'rgba(210,180,100,0.10)',
    jupiter: 'rgba(200,140,60,0.10)',
    neptune: 'rgba(30,80,220,0.15)',
  };
  const glow = ctx.createRadialGradient(x, y, r * 0.8, x, y, r * 1.4);
  glow.addColorStop(0, glowMap[type]);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.beginPath();
  ctx.arc(x, y, r * 1.4, 0, Math.PI * 2);
  ctx.fillStyle = glow;
  ctx.fill();
  ctx.closePath();
}

// --- Main Component ---
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

    const handleResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    const handleMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.isActive = true; };
    const handleMouseLeave = () => { mouse.isActive = false; };
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    // --- Star class ---
    class Star {
      x = Math.random() * w; y = Math.random() * h;
      vx = (Math.random() - 0.5); vy = (Math.random() - 0.5);
      radius = Math.random() * 1.4 + 0.3;
      color = `hsla(346, 70%, ${Math.floor(Math.random() * 30 + 70)}%, ${Math.random() * 0.55 + 0.25})`;

      update() {
        const dx = mouse.x - this.x;
        const rect = canvas?.getBoundingClientRect();
        const relY = mouse.y - (rect?.top || 0);
        const dy = relY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxD = 700;
        const force = Math.max(0, (maxD - dist) / maxD);

        if (mouse.isActive && dist < maxD) {
          const fx = dx / dist; const fy = dy / dist;
          this.vx += fx * force * 1.5 + fy * force * 0.6;
          this.vy += fy * force * 1.5 - fx * force * 0.6;
        } else { this.vx *= 0.98; this.vy *= 0.98; this.vx += (Math.random() - 0.5) * 0.15; this.vy += (Math.random() - 0.5) * 0.15; }

        const sp = Math.sqrt(this.vx ** 2 + this.vy ** 2);
        const maxSp = mouse.isActive && dist < maxD ? 18 : 2;
        if (sp > maxSp) { this.vx = (this.vx / sp) * maxSp; this.vy = (this.vy / sp) * maxSp; }
        this.x += this.vx; this.y += this.vy;
        if (mouse.isActive && dist < 10) { this.x = Math.random() > 0.5 ? 0 : w; this.y = Math.random() * h; this.vx = 0; this.vy = 0; }
        if (this.x < 0) this.x = w; if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h; if (this.y > h) this.y = 0;
      }
      draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.fill(); ctx.closePath(); }
    }

    // --- Planet class ---
    class Planet {
      x = Math.random() * w; y = Math.random() * h;
      vx = (Math.random() - 0.5) * 0.5; vy = (Math.random() - 0.5) * 0.5;
      radius = Math.random() * 14 + 10;
      type: PlanetType = PLANET_TYPES[Math.floor(Math.random() * PLANET_TYPES.length)];

      update() {
        const dx = mouse.x - this.x;
        const rect = canvas?.getBoundingClientRect();
        const relY = mouse.y - (rect?.top || 0);
        const dy = relY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxD = 600;
        const force = Math.max(0, (maxD - dist) / maxD);

        if (mouse.isActive && dist < maxD) {
          const fx = dx / dist; const fy = dy / dist;
          this.vx += fx * force * 0.5 + fy * force * 0.2;
          this.vy += fy * force * 0.5 - fx * force * 0.2;
        } else { this.vx *= 0.99; this.vy *= 0.99; }

        const sp = Math.sqrt(this.vx ** 2 + this.vy ** 2);
        if (sp > 5) { this.vx = (this.vx / sp) * 5; this.vy = (this.vy / sp) * 5; }
        this.x += this.vx; this.y += this.vy;
        if (mouse.isActive && dist < this.radius) {
          this.x = Math.random() > 0.5 ? Math.random() * w : (Math.random() > 0.5 ? 0 : w);
          this.y = Math.random() > 0.5 ? Math.random() * h : (Math.random() > 0.5 ? 0 : h);
          this.vx = 0; this.vy = 0;
          this.type = PLANET_TYPES[Math.floor(Math.random() * PLANET_TYPES.length)];
        }
        if (this.x < -50) this.x = w + 50; if (this.x > w + 50) this.x = -50;
        if (this.y < -50) this.y = h + 50; if (this.y > h + 50) this.y = -50;
      }
      draw() { drawPlanet(ctx, this.x, this.y, this.radius, this.type); }
    }

    const stars = Array.from({ length: 320 }, () => new Star());
    const planets = Array.from({ length: 6 }, () => new Planet());

    let animId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 10, 0.25)';
      ctx.fillRect(0, 0, w, h);

      if (mouse.isActive) {
        const rect = canvas?.getBoundingClientRect();
        const relY = mouse.y - (rect?.top || 0);
        const grad = ctx.createRadialGradient(mouse.x, relY, 0, mouse.x, relY, 160);
        grad.addColorStop(0, 'rgba(0,0,0,1)');
        grad.addColorStop(0.1, 'rgba(20,0,10,0.9)');
        grad.addColorStop(0.4, 'hsla(346, 82%, 46%, 0.25)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath(); ctx.arc(mouse.x, relY, 160, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill(); ctx.closePath();
      }

      ctx.shadowBlur = 0;
      stars.forEach(s => { s.update(); s.draw(); });
      planets.forEach(p => { p.update(); p.draw(); });
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
