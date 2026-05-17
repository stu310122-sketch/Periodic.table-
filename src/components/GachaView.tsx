import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ElementData } from '../data';
import { CATEGORIES } from '../constants';

interface GachaViewProps {
    elements: ElementData[];
    onDraw: (el: ElementData) => void;
    onBack: () => void;
}

export const GachaView: React.FC<GachaViewProps> = ({ elements, onDraw, onBack }) => {
    const [phase, setPhase] = useState<'idle' | 'flying' | 'cracking'>('idle');

    const handleDraw = () => {
        if (phase !== 'idle') return;
        setPhase('flying');
        
        // Duration of flying is 1.5s
        setTimeout(() => {
            setPhase('cracking');
            
            // Duration of cracking is ~2s
            setTimeout(() => {
                const finalEl = elements[Math.floor(Math.random() * elements.length)];
                onDraw(finalEl);
                setPhase('idle');
            }, 2000);
        }, 1500);
    };

    return (
        <main className="flex-1 w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-black/40" aria-labelledby="gacha-heading">
            <div className="scanlines" aria-hidden="true"></div>
            <button 
                onClick={onBack} 
                disabled={phase !== 'idle'}
                aria-label="返回首頁" 
                className={`focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff] absolute top-6 left-6 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[#00f0ff] font-bold transition-colors shadow-sm font-mono z-[100] ${phase === 'idle' ? 'hover:bg-white/10' : 'opacity-50 cursor-not-allowed'}`}
            >
                ⬅ 回首頁
            </button>
            <div className="text-center z-10 w-full flex flex-col items-center relative">
                <h2 id="gacha-heading" className="text-4xl font-black text-white mb-2 tracking-widest glowing-text">命運盲盒抽卡機</h2>
                <p className="text-[#a5f3fc] font-mono mb-10 text-sm tracking-widest">點擊卡牌，抽取你的今日專屬元素！</p>
                
                <div className="relative w-64 h-80 flex items-center justify-center">
                    <div 
                        className="absolute z-[30] rounded-full mix-blend-screen pointer-events-none"
                        style={{
                            width: '150px',
                            height: '150px',
                            background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(0,240,255,0.8) 30%, rgba(0,240,255,0) 70%)',
                            opacity: phase === 'flying' ? 1 : 0,
                            transform: phase === 'flying' ? 'scale(1)' : phase === 'cracking' ? 'scale(1.5)' : 'scale(0)',
                            transition: phase === 'flying' ? 'all 1.5s ease-in' : 'all 0.2s',
                            filter: phase === 'flying' ? 'drop-shadow(0 0 20px #00f0ff)' : 'none'
                        }}
                    />

                    {phase === 'cracking' && (
                        <>
                            <div className="absolute inset-0 z-[40] pointer-events-none rounded-2xl" style={{ animation: 'blueFlash 1.5s ease-out forwards' }}></div>
                            <ExplosionParticles />
                        </>
                    )}

                    <button 
                        onClick={handleDraw}
                        aria-label="點擊抽取隨機元素"
                        disabled={phase !== 'idle'}
                        className={`absolute inset-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#00f0ff] focus-visible:ring-offset-2 focus-visible:ring-offset-black w-full h-full rounded-2xl bg-gradient-to-br from-[#00f0ff]/20 to-[#00f0ff]/5 p-1 shadow-[0_0_30px_rgba(0,240,255,0.2)] gacha-card ${phase === 'idle' ? 'animate-float cursor-pointer hover:shadow-[0_0_50px_rgba(0,240,255,0.5)]' : 'pointer-events-none'}`}
                        style={{
                            opacity: phase === 'idle' ? 1 : 0,
                            transform: phase === 'idle' ? 'scale(1)' : 'scale(0.8)',
                            transition: 'all 0.4s ease-in-out'
                        }}
                    >
                        <div className="w-full h-full border border-[#00f0ff]/50 rounded-[15px] flex flex-col items-center justify-center relative overflow-hidden bg-black/60 backdrop-blur-sm">
                            <div className="absolute inset-0 pattern-grid opacity-30" aria-hidden="true"></div>
                            
                            {phase === 'idle' && (
                                <>
                                    <div className="text-8xl mb-4 filter drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]" aria-hidden="true">❓</div>
                                    <div className="text-[#00f0ff] font-black text-xl tracking-widest font-mono" aria-live="polite">
                                        點擊抽取
                                    </div>
                                </>
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {phase === 'flying' && <FlyingCards elements={elements} />}
        </main>
    );
};

const ExplosionParticles = () => {
    const particles = useMemo(() => Array.from({ length: 300 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 200 + Math.random() * 1200; // Faster speed for big explosion
        const duration = 0.5 + Math.random() * 2.0;
        const size = 2 + Math.random() * 12; // Bigger size variance
        const colors = ['#00f0ff', '#ff00ff', '#facc15', '#ffffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return {
            id: i,
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed,
            duration,
            size,
            color,
            delay: Math.random() * 0.1 // Less delay, more simultaneous
        };
    }), []);

    return (
        <div className="absolute inset-0 pointer-events-none z-[60] flex items-center justify-center">
            {particles.map(p => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{ 
                        width: p.size, 
                        height: p.size, 
                        backgroundColor: p.color,
                        boxShadow: `0 0 ${p.size * 2}px ${p.color}`
                    }}
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{ x: p.x, y: p.y, scale: 0, opacity: 0 }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        ease: "easeOut"
                    }}
                />
            ))}
        </div>
    );
};

const FlyingCards = ({ elements }: { elements: ElementData[] }) => {
    const cards = useMemo(() => Array.from({ length: 80 }).map((_, i) => {
        // Distribute points on a sphere
        const phi = Math.acos(-1 + (2 * i) / 80);
        const theta = Math.sqrt(80 * Math.PI) * phi;
        const radius = 600 + Math.random() * 300;
        
        const startX = radius * Math.cos(theta) * Math.sin(phi);
        const startY = radius * Math.sin(theta) * Math.sin(phi);
        const startZ = radius * Math.cos(phi);
        const element = elements[Math.floor(Math.random() * elements.length)];

        return {
            id: i,
            element,
            color: CATEGORIES[element.cat]?.hex || '#00f0ff',
            startX,
            startY,
            startZ,
            startRotX: Math.random() * 360,
            startRotY: Math.random() * 360,
            startRotZ: Math.random() * 360,
            delay: Math.random() * 0.4, 
            duration: 0.8 + Math.random() * 0.3, 
        };
    }), [elements]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden" style={{ perspective: '1200px' }}>
            {cards.map(c => (
                <motion.div 
                    key={c.id} 
                    className="absolute w-16 h-20 sm:w-20 sm:h-24 border rounded-lg flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-hidden"
                    style={{ borderColor: c.color, color: c.color, boxShadow: `0 0 15px ${c.color}66` }}
                    initial={{ x: c.startX, y: c.startY, z: c.startZ, rotateX: c.startRotX, rotateY: c.startRotY, rotateZ: c.startRotZ, opacity: 0 }}
                    animate={{
                        x: [c.startX, c.startX * 0.5, 0],
                        y: [c.startY, c.startY * 0.5, 0],
                        z: [c.startZ, c.startZ * 0.5, 0],
                        rotateX: [c.startRotX, c.startRotX + 180, c.startRotX + 360],
                        rotateY: [c.startRotY, c.startRotY + 180, c.startRotY + 360],
                        rotateZ: [c.startRotZ, c.startRotZ + 180, c.startRotZ + 360],
                        scale: [1.2, 1, 0],
                        opacity: [0, 1, 1, 0]
                    }}
                    transition={{
                        duration: c.duration,
                        delay: c.delay,
                        ease: "easeIn",
                        times: [0, 0.6, 1]
                    }}
                >
                    <div className="absolute inset-0 pattern-grid opacity-30"></div>
                    <div className="flex flex-col items-center justify-center text-center relative z-10">
                        <span className="text-[10px] absolute top-1 left-1 opacity-80" style={{ color: c.color }}>{c.element.number}</span>
                        <span className="text-2xl sm:text-3xl font-bold mt-2" style={{ color: c.color }}>{c.element.symbol}</span>
                        <span className="text-[9px] sm:text-[11px] opacity-80 mt-1 truncate w-full px-1" style={{ color: c.color }}>{c.element.name}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
