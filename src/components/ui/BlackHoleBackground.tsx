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
      mouse.x = w / 2;
      mouse.y = h / 2;
    };
    window.addEventListener('resize', handleResize);
    
    // Throttle mouse updates slightly for performance if needed, but modern browsers handle this well.
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY + window.scrollY; // adjust for scroll if needed, though Hero is usually at top
      mouse.isActive = true;
    };
    const handleMouseLeave = () => {
      mouse.isActive = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      isPlanet: boolean;

      constructor(x?: number, y?: number) {
        this.x = x || Math.random() * w;
        this.y = y || Math.random() * h;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        
        // Some are "planets" (larger), most are stars
        this.isPlanet = Math.random() > 0.96;
        this.radius = this.isPlanet ? Math.random() * 4 + 3 : Math.random() * 1.5 + 0.5;
        
        // Theme Colors: HSL(346, 82%, 46%) is the primary pink/red
        if (this.isPlanet) {
          // Planets have more solid theme colors
          this.color = `hsla(346, 82%, ${Math.floor(Math.random() * 20 + 40)}%, ${Math.random() * 0.4 + 0.6})`;
        } else {
          // Stars are lighter, more ethereal
          this.color = `hsla(346, 70%, ${Math.floor(Math.random() * 30 + 70)}%, ${Math.random() * 0.6 + 0.2})`;
        }
      }

      update() {
        let dx = mouse.x - this.x;
        let rect = canvas?.getBoundingClientRect();
        let relativeMouseY = mouse.y - (rect?.top || 0);
        let dy = relativeMouseY - this.y;
        
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        const maxDistance = 700; 
        let force = (maxDistance - distance) / maxDistance;
        if (force < 0) force = 0;
        
        if (mouse.isActive && distance < maxDistance) {
          // Planets have more inertia (pulled slightly less or slower acceleration)
          const gravity = this.isPlanet ? 0.8 : 1.4; 
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          
          this.vx += forceDirectionX * force * gravity;
          this.vy += forceDirectionY * force * gravity;
          
          const swirlStrength = this.isPlanet ? 0.3 : 0.6;
          this.vx += forceDirectionY * force * swirlStrength;
          this.vy -= forceDirectionX * force * swirlStrength;
        } else {
          this.vx *= 0.99;
          this.vy *= 0.99;
          this.vx += (Math.random() - 0.5) * 0.2;
          this.vy += (Math.random() - 0.5) * 0.2;
        }
        
        const maxSpeed = mouse.isActive && distance < maxDistance ? (this.isPlanet ? 8 : 18) : 2;
        const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (currentSpeed > maxSpeed) {
           this.vx = (this.vx / currentSpeed) * maxSpeed;
           this.vy = (this.vy / currentSpeed) * maxSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (mouse.isActive && distance < 10) {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            if (this.x > 20 && this.x < w - 20 && this.y > 20 && this.y < h - 20) {
               // respawn at edges instead
               if (Math.random() > 0.5) this.x = Math.random() > 0.5 ? 0 : w;
               else this.y = Math.random() > 0.5 ? 0 : h;
            }
            this.vx = 0;
            this.vy = 0;
        }

        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add a slight glow to planets
        if (this.isPlanet) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = this.color;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.closePath();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 350; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 10, 0.25)'; 
      ctx.fillRect(0, 0, w, h);
      
      if (mouse.isActive) {
        let rect = canvas?.getBoundingClientRect();
        let relativeMouseY = mouse.y - (rect?.top || 0);
        
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(mouse.x, relativeMouseY, 0, mouse.x, relativeMouseY, 150);
        gradient.addColorStop(0, 'rgba(0,0,0,1)'); 
        gradient.addColorStop(0.1, 'rgba(20, 0, 10, 0.9)'); 
        gradient.addColorStop(0.4, 'hsla(346, 82%, 46%, 0.2)'); // Theme-matched glow
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.arc(mouse.x, relativeMouseY, 150, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
      }

      ctx.shadowBlur = 0; // Reset shadow for efficiency
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 w-full h-full pointer-events-none"
    />
  );
};

export default BlackHoleBackground;
