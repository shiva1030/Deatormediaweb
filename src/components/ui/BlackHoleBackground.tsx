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

    const handleResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    const handleMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.isActive = true; };
    const handleMouseLeave = () => { mouse.isActive = false; };
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    class Star {
      x = Math.random() * w;
      y = Math.random() * h;
      vx = (Math.random() - 0.5) * 1;
      vy = (Math.random() - 0.5) * 1;
      radius = Math.random() * 1.8 + 0.3;
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
        } else {
          this.vx *= 0.98; this.vy *= 0.98;
          this.vx += (Math.random() - 0.5) * 0.15;
          this.vy += (Math.random() - 0.5) * 0.15;
        }

        const sp = Math.sqrt(this.vx ** 2 + this.vy ** 2);
        const maxSp = mouse.isActive && dist < maxD ? 18 : 2;
        if (sp > maxSp) { this.vx = (this.vx / sp) * maxSp; this.vy = (this.vy / sp) * maxSp; }
        this.x += this.vx; this.y += this.vy;

        if (mouse.isActive && dist < 10) {
          this.x = Math.random() > 0.5 ? 0 : w;
          this.y = Math.random() * h;
          this.vx = 0; this.vy = 0;
        }
        if (this.x < 0) this.x = w; if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h; if (this.y > h) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }
    }

    const stars = Array.from({ length: 400 }, () => new Star());

    let animId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 10, 0.22)';
      ctx.fillRect(0, 0, w, h);

      if (mouse.isActive) {
        const rect = canvas?.getBoundingClientRect();
        const relY = mouse.y - (rect?.top || 0);
        const grad = ctx.createRadialGradient(mouse.x, relY, 0, mouse.x, relY, 160);
        grad.addColorStop(0, 'rgba(0,0,0,1)');
        grad.addColorStop(0.1, 'rgba(20,0,10,0.9)');
        grad.addColorStop(0.4, 'hsla(346, 82%, 46%, 0.25)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(mouse.x, relY, 160, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.closePath();
      }

      ctx.shadowBlur = 0;
      stars.forEach(s => { s.update(); s.draw(); });
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
