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

    const isMobile = w < 768;
    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 100) {
        mouse.isActive = false;
        return;
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isActive = true;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        if (touch.clientY < 100) {
          mouse.isActive = false;
          return;
        }
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
        mouse.isActive = true;
      }
    };
    
    const handleMouseLeave = () => { mouse.isActive = false; };
    const handleTouchEnd = () => { mouse.isActive = false; };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);
    window.addEventListener('touchstart', handleTouchMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // --- Draw deep space nebula background once ---
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = w; bgCanvas.height = h;
    const bgCtx = bgCanvas.getContext('2d')!;

    // Deep space base
    bgCtx.fillStyle = '#020408';
    bgCtx.fillRect(0, 0, w, h);

    // Subtle nebula blobs
    const nebulas = [
      { x: w * 0.2, y: h * 0.3, r: isMobile ? 150 : 300, color: 'rgba(60, 0, 80, 0.07)' },
      { x: w * 0.8, y: h * 0.6, r: isMobile ? 120 : 250, color: 'rgba(0, 20, 80, 0.07)' },
      { x: w * 0.5, y: h * 0.8, r: isMobile ? 100 : 200, color: 'rgba(80, 0, 30, 0.06)' },
      { x: w * 0.1, y: h * 0.8, r: isMobile ? 90 : 180, color: 'rgba(0, 40, 80, 0.05)' },
      { x: w * 0.9, y: h * 0.2, r: isMobile ? 110 : 220, color: 'rgba(60, 10, 50, 0.06)' },
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
        this.baseRadius = Math.random() * (isMobile ? 1.0 : 1.5) + 0.3;
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
        this.glows = Math.random() > 0.6; // 40% of stars glow
      }

      update(time: number) {
        // Twinkle: radius and opacity oscillate
        const twinkle = Math.sin(time * this.twinkleSpeed + this.twinklePhase);
        this.radius = this.baseRadius + twinkle * this.baseRadius * 0.8;
        this.opacity = this.baseOpacity + twinkle * 0.25;

        // Gravity pull
        const dx = mouse.x - this.x;
        const rect = canvas?.getBoundingClientRect();
        const relY = mouse.y - (rect?.top || 0);
        const dy = relY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxD = isMobile ? 350 : 700;
        const force = Math.max(0, (maxD - dist) / maxD);

        if (mouse.isActive && dist < maxD) {
          const fx = dx / dist; const fy = dy / dist;
          // Orbital mechanics: swirl >> radial so stars orbit instead of falling in
          // Closer stars get STRONGER tangential push (like real orbital velocity)
          const orbitalBoost = dist < (isMobile ? 100 : 200) ? 2.0 : 1.2;
          this.vx += fx * force * 0.7 + fy * force * orbitalBoost;
          this.vy += fy * force * 0.7 - fx * force * orbitalBoost;
        } else {
          this.vx *= 0.985; this.vy *= 0.985;
          this.vx += (Math.random() - 0.5) * 0.04;
          this.vy += (Math.random() - 0.5) * 0.04;
        }

        const sp = Math.sqrt(this.vx ** 2 + this.vy ** 2);
        // Allow a bit faster orbital speed but not too fast
        const maxSp = mouse.isActive && dist < maxD ? 8 : 0.8;
        if (sp > maxSp) { this.vx = (this.vx / sp) * maxSp; this.vy = (this.vy / sp) * maxSp; }
        this.x += this.vx; this.y += this.vy;

        // Keep orbital distance — only consume stars that get very close
        if (mouse.isActive && dist < (isMobile ? 30 : 60)) {
          this.x = Math.random() > 0.5 ? 0 : w;
          this.y = Math.random() * h;
          this.vx = (Math.random() - 0.5) * 1.0;
          this.vy = (Math.random() - 0.5) * 1.0;
        }
        if (this.x < 0) this.x = w; if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h; if (this.y > h) this.y = 0;
      }

      draw() {
        const op = Math.max(0, Math.min(1, this.opacity));

        if (this.glows) {
          // Soft outer glow
          const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 6);
          glow.addColorStop(0, `rgba(${this.color}, ${op * 0.6})`);
          glow.addColorStop(0.4, `rgba(${this.color}, ${op * 0.15})`);
          glow.addColorStop(1, `rgba(${this.color}, 0)`);
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 6, 0, Math.PI * 2);
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

    const starCount = isMobile ? 350 : 750;
    const stars = Array.from({ length: starCount }, () => new Star());

    let animId: number;
    let time = 0;
    const animate = () => {
      time++;

      // Draw static bg
      ctx.drawImage(bgCanvas, 0, 0);

      // Dim overlay for motion trails
      ctx.fillStyle = 'rgba(2, 4, 8, 0.07)';
      ctx.fillRect(0, 0, w, h);

      // Black hole glow at mouse
      if (mouse.isActive) {
        const rect = canvas?.getBoundingClientRect();
        const relY = mouse.y - (rect?.top || 0);
        const glowSize = isMobile ? 120 : 200;
        const grad = ctx.createRadialGradient(mouse.x, relY, 0, mouse.x, relY, glowSize);
        grad.addColorStop(0, 'rgba(0,0,0,1)');
        grad.addColorStop(0.08, 'rgba(10,0,5,0.97)');
        grad.addColorStop(0.25, 'hsla(346, 90%, 50%, 0.35)');
        grad.addColorStop(0.55, 'hsla(346, 80%, 40%, 0.12)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(mouse.x, relY, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = grad;
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
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full pointer-events-none" />;
};

export default BlackHoleBackground;
