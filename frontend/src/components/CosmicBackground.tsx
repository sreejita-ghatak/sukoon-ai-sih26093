import React, { useEffect, useRef } from 'react';

export const CosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Cosmic Particle system with distinct types & density distribution
    interface StarParticle {
      x: number;
      y: number;
      radius: number;
      baseAlpha: number;
      currentAlpha: number;
      vx: number;
      vy: number;
      twinkleSpeed: number;
      twinklePhase: number;
      color: string;
      type: 'dim' | 'lavender' | 'twinkle' | 'bokeh';
      oscillationSpeed?: number;
      oscillationAmp?: number;
    }

    let particles: StarParticle[] = [];

    const initParticles = () => {
      particles = [];
      const count = Math.min(180, Math.floor(Math.max(width, 700) / 7.5));

      for (let i = 0; i < count; i++) {
        // Higher density on the right (around lotus ~0.45-0.95), lower on the left (text area)
        const isRightBiased = Math.random() < 0.72;
        const x = isRightBiased
          ? (0.42 + Math.random() * 0.56) * width
          : Math.random() * width * 0.42;

        const y = Math.random() * height * 0.95;

        // Determine particle type
        const roll = Math.random();
        let type: StarParticle['type'];
        let radius: number;
        let baseAlpha: number;
        let color: string;
        let twinkleSpeed = Math.random() * 0.02 + 0.008;

        if (roll < 0.52) {
          // 1. Many tiny dim violet star particles
          type = 'dim';
          radius = Math.random() * 0.45 + 0.35;
          baseAlpha = Math.random() * 0.16 + 0.12;
          color = Math.random() > 0.4 ? '168, 85, 247' : '147, 51, 234';
        } else if (roll < 0.82) {
          // 2. Sparse brighter lavender points
          type = 'lavender';
          radius = Math.random() * 0.55 + 0.75;
          baseAlpha = Math.random() * 0.25 + 0.35;
          color = Math.random() > 0.5 ? '216, 180, 254' : '225, 195, 254';
        } else if (roll < 0.93) {
          // 3. Occasional tiny white-violet twinkles
          type = 'twinkle';
          radius = Math.random() * 0.6 + 1.0;
          baseAlpha = Math.random() * 0.3 + 0.45;
          twinkleSpeed = Math.random() * 0.035 + 0.018;
          color = '255, 250, 255';
        } else {
          // 4. Few subtle soft bokeh particles
          type = 'bokeh';
          radius = Math.random() * 3.5 + 3.0;
          baseAlpha = Math.random() * 0.06 + 0.05;
          color = Math.random() > 0.5 ? '192, 132, 252' : '232, 121, 249';
        }

        particles.push({
          x,
          y,
          radius,
          baseAlpha,
          currentAlpha: baseAlpha,
          vx: (Math.random() * 0.12 - 0.04), // gentle rightward slow drift
          vy: -(Math.random() * 0.12 + 0.03), // gentle upward float
          twinkleSpeed,
          twinklePhase: Math.random() * Math.PI * 2,
          color,
          type,
          oscillationSpeed: Math.random() * 0.02 + 0.01,
          oscillationAmp: Math.random() * 0.5 + 0.2,
        });
      }
    };

    initParticles();

    // 5 Organic Soft Flowing Cosmic Light Wisps (Aurora / Luminous Silk Energy)
    interface CosmicWispConfig {
      id: string;
      spanStart: number;
      spanEnd: number;
      baseYFactor: number;
      radius: number;
      freq1: number;
      freq2: number;
      amp1: number;
      amp2: number;
      speed: number;
      phase: number;
      color: string;
      peakAlpha: number;
      upwardCurveFactor?: number;
    }

    const wisps: CosmicWispConfig[] = [
      // Wisp 1: Lower-left soft violet veil drifting towards center
      {
        id: 'wisp-left-lower',
        spanStart: -0.08,
        spanEnd: 0.58,
        baseYFactor: 0.80,
        radius: 75,
        freq1: 0.0018,
        freq2: 0.0036,
        amp1: 18,
        amp2: 10,
        speed: 0.16,
        phase: 0.4,
        color: '147, 51, 234', // soft violet
        peakAlpha: 0.048,
      },
      // Wisp 2: Central flowing lavender aurora stream
      {
        id: 'wisp-mid-lavender',
        spanStart: 0.18,
        spanEnd: 0.84,
        baseYFactor: 0.84,
        radius: 85,
        freq1: 0.0015,
        freq2: 0.0031,
        amp1: 22,
        amp2: 12,
        speed: 0.22,
        phase: 2.2,
        color: '216, 180, 254', // luminous lavender
        peakAlpha: 0.042,
      },
      // Wisp 3: Gentle upward-tapering luminous wisp (fades out completely before lotus)
      {
        id: 'wisp-rising-magenta',
        spanStart: 0.38,
        spanEnd: 0.78,
        baseYFactor: 0.74,
        radius: 60,
        freq1: 0.0022,
        freq2: 0.0044,
        amp1: 16,
        amp2: 8,
        speed: 0.18,
        phase: 3.8,
        color: '232, 121, 249', // subtle magenta-lilac
        peakAlpha: 0.040,
        upwardCurveFactor: 28,
      },
      // Wisp 4: Deep amethyst foundation drift along bottom
      {
        id: 'wisp-deep-base',
        spanStart: -0.05,
        spanEnd: 1.05,
        baseYFactor: 0.90,
        radius: 100,
        freq1: 0.0012,
        freq2: 0.0024,
        amp1: 24,
        amp2: 14,
        speed: 0.12,
        phase: 1.1,
        color: '126, 34, 206', // deep amethyst
        peakAlpha: 0.038,
      },
      // Wisp 5: Mid-right soft ethereal stream drifting under lotus space
      {
        id: 'wisp-right-ethereal',
        spanStart: 0.52,
        spanEnd: 1.08,
        baseYFactor: 0.78,
        radius: 70,
        freq1: 0.0017,
        freq2: 0.0034,
        amp1: 19,
        amp2: 9,
        speed: 0.14,
        phase: 4.6,
        color: '192, 132, 252', // radiant lilac
        peakAlpha: 0.044,
      },
    ];

    let time = 0;

    const render = () => {
      // Very slow, meditative cinematic time step
      time += 0.008;
      ctx.clearRect(0, 0, width, height);

      // 1. Subtle Violet Atmospheric Glow behind Lotus (Environmental integration without disk/frame)
      const isMobile = width < 1024;
      const lotusCenterX = isMobile ? width * 0.5 : width * 0.73;
      const lotusCenterY = isMobile ? height * 0.24 : height * 0.46;
      const lotusGlowRadius = Math.min(width, height) * (isMobile ? 0.42 : 0.48);

      const lotusAtmoGrad = ctx.createRadialGradient(
        lotusCenterX,
        lotusCenterY,
        0,
        lotusCenterX,
        lotusCenterY,
        lotusGlowRadius
      );
      lotusAtmoGrad.addColorStop(0, 'rgba(168, 85, 247, 0.055)');
      lotusAtmoGrad.addColorStop(0.45, 'rgba(147, 51, 234, 0.022)');
      lotusAtmoGrad.addColorStop(1, 'rgba(3, 1, 8, 0)');

      ctx.fillStyle = lotusAtmoGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Render Cosmic Particle Field with Independent Drifting and Twinkling
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Smooth drifting motion
        p.x += p.vx;
        if (p.oscillationSpeed && p.oscillationAmp) {
          p.y += p.vy + Math.sin(time * p.oscillationSpeed + p.twinklePhase) * p.oscillationAmp * 0.25;
        } else {
          p.y += p.vy;
        }

        // Seamless wrap around edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Dynamic twinkling calculation
        const twinkleCycle = Math.sin(time * (p.twinkleSpeed * 60) + p.twinklePhase);
        if (p.type === 'twinkle') {
          // Sharp delicate flare on twinkling stars
          p.currentAlpha = Math.max(0.12, Math.min(0.92, p.baseAlpha + twinkleCycle * 0.42));
        } else if (p.type === 'bokeh') {
          p.currentAlpha = Math.max(0.02, Math.min(0.16, p.baseAlpha + twinkleCycle * 0.04));
        } else {
          p.currentAlpha = Math.max(0.06, Math.min(0.75, p.baseAlpha + twinkleCycle * 0.16));
        }

        ctx.beginPath();

        if (p.type === 'bokeh') {
          const bokehGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          bokehGrad.addColorStop(0, `rgba(${p.color}, ${p.currentAlpha})`);
          bokehGrad.addColorStop(0.6, `rgba(${p.color}, ${p.currentAlpha * 0.4})`);
          bokehGrad.addColorStop(1, `rgba(${p.color}, 0)`);
          ctx.fillStyle = bokehGrad;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${p.currentAlpha})`;
          ctx.fill();

          // Delicate micro sparkle halo for bright twinkling points
          if (p.type === 'twinkle' && p.currentAlpha > 0.65) {
            ctx.save();
            ctx.strokeStyle = `rgba(${p.color}, ${(p.currentAlpha - 0.65) * 0.8})`;
            ctx.lineWidth = 0.6;
            const flareLen = p.radius * 2.6;
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

      // 3. Render Seamless Feathered Cosmic Light Wisps (NO strokes, NO wires, NO contour lines)
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      for (let w = 0; w < wisps.length; w++) {
        const wisp = wisps[w];
        const flowTime = time * wisp.speed + wisp.phase;
        
        const startX = wisp.spanStart * width;
        const endX = wisp.spanEnd * width;
        const totalSpan = endX - startX;
        const baseY = height * wisp.baseYFactor;

        // Sample organic points along the wisp with overlapping feathered light stamps
        const steps = 28;
        const dx = totalSpan / steps;

        for (let s = 0; s <= steps; s++) {
          const curX = startX + s * dx;
          const progress = s / steps; // 0 to 1

          // Natural bell curve fade at ends so each wisp fades completely into the dark void
          const edgeEnvelope = Math.sin(progress * Math.PI);
          if (edgeEnvelope <= 0.01) continue;

          // Harmonic undulations
          const undulation1 = Math.sin(curX * wisp.freq1 - flowTime) * wisp.amp1;
          const undulation2 = Math.cos(curX * wisp.freq2 + flowTime * 0.7) * wisp.amp2;
          
          // Gentle upward lift if configured (e.g. rising wisp)
          let upwardShift = 0;
          if (wisp.upwardCurveFactor) {
            upwardShift = Math.sin(progress * Math.PI) * wisp.upwardCurveFactor;
          }

          const curY = baseY + undulation1 + undulation2 - upwardShift;

          // Crucial safety check: Fade before touching or crossing the lotus
          const distToLotusX = Math.abs(curX - lotusCenterX);
          const distToLotusY = curY - lotusCenterY;
          let lotusProximityFade = 1.0;

          // If horizontally near lotus and vertically within its lower zone, smoothly fade out
          if (distToLotusX < width * 0.24 && distToLotusY < height * 0.28 && distToLotusY > -height * 0.1) {
            const normDistX = distToLotusX / (width * 0.24);
            const normDistY = Math.max(0, distToLotusY / (height * 0.28));
            lotusProximityFade = Math.min(1.0, Math.pow(normDistX * 0.7 + normDistY * 0.6, 1.5));
          }

          const effectiveAlpha = wisp.peakAlpha * Math.pow(edgeEnvelope, 1.3) * lotusProximityFade;
          if (effectiveAlpha <= 0.002) continue;

          // Radius modulates gently along the stream
          const currentRadius = wisp.radius * (0.8 + 0.35 * Math.sin(progress * Math.PI * 2 + flowTime * 0.5));

          // Draw completely borderless soft feathered radial light puff
          const puffGrad = ctx.createRadialGradient(curX, curY, 0, curX, curY, currentRadius);
          puffGrad.addColorStop(0, `rgba(${wisp.color}, ${effectiveAlpha})`);
          puffGrad.addColorStop(0.4, `rgba(${wisp.color}, ${effectiveAlpha * 0.55})`);
          puffGrad.addColorStop(0.75, `rgba(${wisp.color}, ${effectiveAlpha * 0.18})`);
          puffGrad.addColorStop(1, `rgba(${wisp.color}, 0)`);

          ctx.fillStyle = puffGrad;
          ctx.beginPath();
          ctx.arc(curX, curY, currentRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030108]">
      {/* Subtle deep space ambient background */}
      <div 
        className="absolute top-1/4 left-1/3 w-[650px] h-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-950/10 blur-[180px] pointer-events-none" 
      />
      
      {/* Canvas rendering stars, atmospheric glow, and 5 flowing silk energy ribbons */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

