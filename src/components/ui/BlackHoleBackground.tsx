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

      constructor(x?: number, y?: number) {
        this.x = x || Math.random() * w;
        this.y = y || Math.random() * h;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.radius = Math.random() * 2 + 0.5;
        this.color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, ${Math.random() * 0.6 + 0.2})`;
      }

      update() {
        let dx = mouse.x - this.x;
        // Adjust mouse Y relative to the canvas position (important if user scrolls!)
        let rect = canvas?.getBoundingClientRect();
        let relativeMouseY = mouse.y - (rect?.top || 0);
        let dy = relativeMouseY - this.y;
        
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        // Gravity effect
        const maxDistance = 600; // Pull radius
        let force = (maxDistance - distance) / maxDistance;
        if (force < 0) force = 0;
        
        if (mouse.isActive && distance < maxDistance) {
          const gravity = 1.2; // Strength of black hole pull
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          
          this.vx += forceDirectionX * force * gravity;
          this.vy += forceDirectionY * force * gravity;
          
          // Tangential force (creates the swirl/vortex effect)
          const swirlStrength = 0.5;
          this.vx += forceDirectionY * force * swirlStrength;
          this.vy -= forceDirectionX * force * swirlStrength;
        } else {
          // Slow down and gently drift when mouse is not active or out of range
          this.vx *= 0.98;
          this.vy *= 0.98;
          this.vx += (Math.random() - 0.5) * 0.3;
          this.vy += (Math.random() - 0.5) * 0.3;
        }
        
        // friction / speed limit
        const maxSpeed = mouse.isActive && distance < maxDistance ? 15 : 2;
        const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (currentSpeed > maxSpeed) {
           this.vx = (this.vx / currentSpeed) * maxSpeed;
           this.vy = (this.vy / currentSpeed) * maxSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Black hole consumption (event horizon)
        if (mouse.isActive && distance < 15) {
            // "Respawn" particle at edge of screen
            if (Math.random() > 0.5) {
                this.x = Math.random() > 0.5 ? 0 : w;
                this.y = Math.random() * h;
            } else {
                this.x = Math.random() * w;
                this.y = Math.random() > 0.5 ? 0 : h;
            }
            this.vx = 0;
            this.vy = 0;
        }

        // Screen wrap (if they drift off naturally)
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
        ctx.closePath();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 300; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;
    const animate = () => {
      // Create trails by not clearing the canvas fully (opacity controls trail length)
      // Dark background with slight transparency for motion blur
      ctx.fillStyle = 'rgba(5, 5, 10, 0.2)'; 
      ctx.fillRect(0, 0, w, h);
      
      // Draw event horizon / black hole glow if active
      if (mouse.isActive) {
        let rect = canvas?.getBoundingClientRect();
        let relativeMouseY = mouse.y - (rect?.top || 0);
        
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(mouse.x, relativeMouseY, 0, mouse.x, relativeMouseY, 120);
        gradient.addColorStop(0, 'rgba(0,0,0,1)'); // core
        gradient.addColorStop(0.1, 'rgba(10, 0, 40, 0.8)'); // event horizon
        gradient.addColorStop(0.4, 'rgba(100,0,255,0.15)'); // accretion disk glow
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.arc(mouse.x, relativeMouseY, 120, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
      }

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
