import React, { useEffect, useRef } from 'react';
import attachedLotusImg from '../assets/images/attached_lotus_blossom_transparent.png';

interface LuminousLotusHeroProps {
  className?: string;
}

interface LocalParticle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  radius: number;
  baseAlpha: number;
  currentAlpha: number;
  vx: number;
  vy: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  type: 'dust' | 'star' | 'bokeh' | 'sparkle' | 'ground-fleck';
  oscillationSpeed: number;
  oscillationAmp: number;
}

export const LuminousLotusHero: React.FC<LuminousLotusHeroProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let particles: LocalParticle[] = [];
    let time = 0;

    const setupCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      // Expand slightly to ensure particles float and fade out seamlessly outside lotus bounds
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initLocalAtmosphere();
    };

    const initLocalAtmosphere = () => {
      particles = [];
      if (width <= 0 || height <= 0) return;

      const cx = width * 0.5;
      const cy = height * 0.48; // Center of the lotus bloom
      const maxRadius = Math.min(width, height) * 0.58;
      const groundY = height * 0.76; // Grounding zone directly beneath lotus base

      // 1. Clustered Atmospheric Celestial Particles around & behind the lotus
      const totalParticles = Math.floor(Math.min(95, Math.max(55, width * 0.18)));

      for (let i = 0; i < totalParticles; i++) {
        const roll = Math.random();
        let type: LocalParticle['type'];
        let radius: number;
        let baseAlpha: number;
        let color: string;
        let twinkleSpeed: number;
        let dist: number;
        let angle = Math.random() * Math.PI * 2;
        let pX: number;
        let pY: number;

        if (roll < 0.46) {
          // A. Very tiny violet, lavender & lilac glowing dust
          type = 'dust';
          radius = Math.random() * 0.5 + 0.35;
          baseAlpha = Math.random() * 0.28 + 0.18;
          twinkleSpeed = Math.random() * 0.012 + 0.005;
          const dustColors = ['168, 85, 247', '192, 132, 252', '216, 180, 254', '147, 51, 234'];
          color = dustColors[Math.floor(Math.random() * dustColors.length)];
          // Clustered around the flower with soft radial falloff
          dist = Math.pow(Math.random(), 0.72) * maxRadius * 0.95;
          pX = cx + Math.cos(angle) * dist * 1.08;
          pY = cy + Math.sin(angle) * dist * 0.88;

        } else if (roll < 0.72) {
          // B. Tiny white-violet star points & petal-tip glints
          type = 'star';
          radius = Math.random() * 0.55 + 0.65;
          baseAlpha = Math.random() * 0.35 + 0.35;
          twinkleSpeed = Math.random() * 0.02 + 0.008;
          color = Math.random() > 0.4 ? '245, 240, 255' : '233, 213, 255';
          dist = Math.pow(Math.random(), 0.6) * maxRadius * 0.82;
          pX = cx + Math.cos(angle) * dist * 1.05;
          pY = cy + Math.sin(angle) * dist * 0.84;

        } else if (roll < 0.84) {
          // C. Sparse delicate sparkles near outer petals
          type = 'sparkle';
          radius = Math.random() * 0.6 + 0.85;
          baseAlpha = Math.random() * 0.4 + 0.42;
          twinkleSpeed = Math.random() * 0.026 + 0.012;
          color = '255, 255, 255';
          // Bias near petal boundaries (0.35 - 0.75 of radius)
          dist = (0.28 + Math.random() * 0.52) * maxRadius;
          pX = cx + Math.cos(angle) * dist * 1.1;
          pY = cy + Math.sin(angle) * dist * 0.85;

        } else if (roll < 0.92) {
          // D. Subtle soft blurred micro-bokeh
          type = 'bokeh';
          radius = Math.random() * 3.2 + 2.8;
          baseAlpha = Math.random() * 0.05 + 0.035;
          twinkleSpeed = Math.random() * 0.008 + 0.004;
          color = Math.random() > 0.5 ? '192, 132, 252' : '216, 180, 254';
          dist = Math.pow(Math.random(), 0.85) * maxRadius * 0.88;
          pX = cx + Math.cos(angle) * dist * 1.05;
          pY = cy + Math.sin(angle) * dist * 0.9;

        } else {
          // E. Base ground reflection flecks directly beneath lotus
          type = 'ground-fleck';
          radius = Math.random() * 0.5 + 0.4;
          baseAlpha = Math.random() * 0.22 + 0.16;
          twinkleSpeed = Math.random() * 0.015 + 0.006;
          color = Math.random() > 0.5 ? '216, 180, 254' : '192, 132, 252';
          const spreadX = (Math.random() - 0.5) * width * 0.55;
          const spreadY = (Math.random() - 0.5) * height * 0.14;
          pX = cx + spreadX;
          pY = groundY + spreadY;
        }

        particles.push({
          x: pX,
          y: pY,
          originX: pX,
          originY: pY,
          radius,
          baseAlpha,
          currentAlpha: baseAlpha,
          // Extremely slow, peaceful drift
          vx: (Math.random() * 0.06 - 0.03),
          vy: -(Math.random() * 0.06 + 0.015), // very slow upward float
          twinkleSpeed,
          twinklePhase: Math.random() * Math.PI * 2,
          color,
          type,
          oscillationSpeed: Math.random() * 0.014 + 0.006,
          oscillationAmp: Math.random() * 0.4 + 0.2,
        });
      }
    };

    setupCanvas();

    const resizeObserver = new ResizeObserver(() => {
      setupCanvas();
    });
    resizeObserver.observe(container);

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.48;
      const groundCenterY = height * 0.77;
      const maxRadius = Math.min(width, height) * 0.58;

      // 1. VERY subtle diffused violet radiance behind the lotus (no visible hard edge or halo disk)
      const diffuseRadiance = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius * 1.05);
      diffuseRadiance.addColorStop(0, 'rgba(168, 85, 247, 0.075)');
      diffuseRadiance.addColorStop(0.28, 'rgba(147, 51, 234, 0.042)');
      diffuseRadiance.addColorStop(0.58, 'rgba(126, 34, 206, 0.014)');
      diffuseRadiance.addColorStop(0.85, 'rgba(88, 28, 135, 0.003)');
      diffuseRadiance.addColorStop(1, 'rgba(3, 1, 8, 0)');

      ctx.fillStyle = diffuseRadiance;
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius * 1.05, 0, Math.PI * 2);
      ctx.fill();

      // 2. Subtle luminous grounding pool directly beneath the lotus (soft horizontal reflection)
      ctx.save();
      ctx.translate(cx, groundCenterY);
      ctx.scale(1.0, 0.22); // soft horizontal spread

      const groundPoolGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, width * 0.46);
      groundPoolGrad.addColorStop(0, 'rgba(216, 180, 254, 0.065)');
      groundPoolGrad.addColorStop(0.35, 'rgba(168, 85, 247, 0.038)');
      groundPoolGrad.addColorStop(0.72, 'rgba(126, 34, 206, 0.01)');
      groundPoolGrad.addColorStop(1, 'rgba(3, 1, 8, 0)');

      ctx.fillStyle = groundPoolGrad;
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.46, 0, Math.PI * 2);
      ctx.fill();

      // Faint central vertical reflection pool under flower core
      const coreReflectGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, width * 0.22);
      coreReflectGrad.addColorStop(0, 'rgba(240, 171, 252, 0.06)');
      coreReflectGrad.addColorStop(0.45, 'rgba(192, 132, 252, 0.022)');
      coreReflectGrad.addColorStop(1, 'rgba(3, 1, 8, 0)');

      ctx.fillStyle = coreReflectGrad;
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Render Independent Atmospheric Local Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Smooth meditative drift
        p.x += p.vx;
        p.y += p.vy + Math.sin(time * p.oscillationSpeed + p.twinklePhase) * p.oscillationAmp * 0.22;

        // Calculate distance from center for edge fadeout
        let distFromCenter: number;
        if (p.type === 'ground-fleck') {
          const dx = (p.x - cx) / (width * 0.38);
          const dy = (p.y - groundCenterY) / (height * 0.12);
          distFromCenter = Math.sqrt(dx * dx + dy * dy);
        } else {
          const dx = (p.x - cx) / (maxRadius * 1.05);
          const dy = (p.y - cy) / (maxRadius * 0.95);
          distFromCenter = Math.sqrt(dx * dx + dy * dy);
        }

        // Seamless local boundary wrap with re-clustering
        if (distFromCenter > 1.08 || p.y < height * 0.05) {
          if (p.type === 'ground-fleck') {
            p.x = cx + (Math.random() - 0.5) * width * 0.5;
            p.y = groundCenterY + (Math.random() - 0.3) * height * 0.1;
          } else {
            const reAngle = Math.random() * Math.PI * 2;
            const reDist = (0.15 + Math.random() * 0.55) * maxRadius;
            p.x = cx + Math.cos(reAngle) * reDist * 1.05;
            p.y = cy + Math.sin(reAngle) * reDist * 0.85 + height * 0.12;
          }
        }

        // Distance attenuation factor: guaranteed 0 opacity before canvas boundaries
        const distanceFade = Math.max(0, Math.min(1, 1 - Math.pow(Math.min(1, distFromCenter), 2.2)));

        // Dynamic twinkle calculation
        const twinkleCycle = Math.sin(time * (p.twinkleSpeed * 60) + p.twinklePhase);
        let alphaMultiplier = 1;

        if (p.type === 'sparkle') {
          alphaMultiplier = 0.4 + 0.6 * Math.pow(Math.max(0, (twinkleCycle + 1) / 2), 2.2);
        } else if (p.type === 'star') {
          alphaMultiplier = 0.6 + 0.4 * twinkleCycle;
        } else if (p.type === 'bokeh') {
          alphaMultiplier = 0.8 + 0.2 * twinkleCycle;
        } else {
          alphaMultiplier = 0.7 + 0.3 * twinkleCycle;
        }

        const finalAlpha = p.baseAlpha * alphaMultiplier * distanceFade;
        if (finalAlpha <= 0.005) continue;

        ctx.beginPath();

        if (p.type === 'bokeh') {
          const bGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          bGrad.addColorStop(0, `rgba(${p.color}, ${finalAlpha})`);
          bGrad.addColorStop(0.55, `rgba(${p.color}, ${finalAlpha * 0.45})`);
          bGrad.addColorStop(1, `rgba(${p.color}, 0)`);
          ctx.fillStyle = bGrad;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${finalAlpha})`;
          ctx.fill();

          // Delicate micro sparkle cross-glint on peak twinkle
          if (p.type === 'sparkle' && finalAlpha > 0.45) {
            ctx.save();
            ctx.strokeStyle = `rgba(${p.color}, ${(finalAlpha - 0.45) * 0.85})`;
            ctx.lineWidth = 0.5;
            const flareLen = p.radius * 2.2;
            ctx.beginPath();
            ctx.moveTo(p.x - flareLen, p.y);
            ctx.lineTo(p.x + flareLen, p.y);
            ctx.moveTo(p.x, p.y - flareLen);
            ctx.lineTo(p.x, p.y + flareLen);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* 1. Local Celestial Particle Canvas & Subtle Diffused Radiance / Grounding Light (Localized strictly around lotus) */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0" 
      />

      {/* 2. Completely Stationary Transparent Lotus Blossom (Stationary artwork, exact locked size & position) */}
      <div className="relative w-full flex items-center justify-center z-10">
        
        {/* Soft Inner Petal Radiance Breathing */}
        <div 
          className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-60 h-36 sm:h-44 rounded-full bg-radial from-fuchsia-400/25 via-violet-600/12 to-transparent blur-xl pointer-events-none animate-inner-radiance"
        />

        {/* The Exact Locked Lotus Artwork Asset - 100% Stationary */}
        <img
          src={attachedLotusImg}
          alt="Luminous Purple Crystal Lotus"
          referrerPolicy="no-referrer"
          className="w-full h-auto max-h-[480px] object-contain pointer-events-none drop-shadow-[0_0_24px_rgba(168,85,247,0.4)] drop-shadow-[0_0_60px_rgba(147,51,234,0.22)]"
        />

        {/* 3. Living Central Breathing Core Light (5.5s smooth continuous light pulse) */}
        <div 
          className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-radial from-white/75 via-fuchsia-200/30 to-transparent blur-md pointer-events-none animate-core-breathe"
        />

        {/* 4. Subtle Sparkling Star Highlights on Petal Tips */}
        <div 
          className="absolute top-[16%] left-[49%] w-1.5 h-1.5 rounded-full bg-white blur-[0.3px] animate-pulse shadow-[0_0_8px_#fff]" 
          style={{ animationDuration: '3.4s' }} 
        />
        <div 
          className="absolute top-[32%] left-[24%] w-1.5 h-1.5 rounded-full bg-purple-200 blur-[0.4px] animate-pulse shadow-[0_0_8px_#d8b4fe]" 
          style={{ animationDuration: '4.6s', animationDelay: '1.2s' }} 
        />
        <div 
          className="absolute top-[32%] right-[24%] w-1.5 h-1.5 rounded-full bg-purple-200 blur-[0.4px] animate-pulse shadow-[0_0_8px_#d8b4fe]" 
          style={{ animationDuration: '4.2s', animationDelay: '2.4s' }} 
        />
        <div 
          className="absolute top-[54%] left-[12%] w-1.5 h-1.5 rounded-full bg-fuchsia-300 blur-[0.4px] animate-pulse shadow-[0_0_8px_#f0abfc]" 
          style={{ animationDuration: '3.8s', animationDelay: '0.8s' }} 
        />
        <div 
          className="absolute top-[54%] right-[12%] w-1.5 h-1.5 rounded-full bg-fuchsia-300 blur-[0.4px] animate-pulse shadow-[0_0_8px_#f0abfc]" 
          style={{ animationDuration: '4.8s', animationDelay: '1.8s' }} 
        />
      </div>

    </div>
  );
};

