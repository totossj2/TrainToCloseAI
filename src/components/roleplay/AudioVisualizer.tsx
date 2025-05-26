import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const barCount = 40;
  
  useEffect(() => {
    if (!isActive) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const bars: number[] = Array(barCount).fill(0);
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create a gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#3730a3');  // indigo-800
      gradient.addColorStop(0.5, '#6366f1'); // indigo-500
      gradient.addColorStop(1, '#0d9488');  // teal-600
      
      ctx.fillStyle = gradient;
      
      const barWidth = (canvas.width / barCount) * 0.8;
      const spacing = (canvas.width / barCount) * 0.2;
      
      for (let i = 0; i < barCount; i++) {
        // Simulate audio activity
        if (isActive) {
          const target = Math.random() * canvas.height * 0.8;
          // Smooth transition to target
          bars[i] = bars[i] + (target - bars[i]) * 0.1;
        } else {
          bars[i] = Math.max(0, bars[i] - 5);
        }
        
        const x = i * (barWidth + spacing);
        const height = bars[i];
        const y = (canvas.height - height) / 2;
        
        // Create rounded bars
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, 4);
        ctx.fill();
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isActive]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-16 rounded-lg"
      width={800}
      height={64}
    />
  );
};

export default AudioVisualizer;