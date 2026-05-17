import React, { useState, useMemo, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PrecipitationLabViewProps {
    onBack: () => void;
}

const CATIONS = [
    { id: 'Ag+', label: 'Ag⁺ (銀離子)', color: '#f8fafc', solutionColor: 'rgba(255,255,255,0.1)' },
    { id: 'Pb2+', label: 'Pb²⁺ (鉛離子)', color: '#cbd5e1', solutionColor: 'rgba(203,213,225,0.1)' },
    { id: 'Ba2+', label: 'Ba²⁺ (鋇離子)', color: '#bbf7d0', solutionColor: 'rgba(187,247,208,0.1)' },
    { id: 'Ca2+', label: 'Ca²⁺ (鈣離子)', color: '#fef08a', solutionColor: 'rgba(254,240,138,0.1)' },
    { id: 'Cu2+', label: 'Cu²⁺ (銅離子)', color: '#60a5fa', solutionColor: 'rgba(59,130,246,0.3)' },
    { id: 'Fe3+', label: 'Fe³⁺ (鐵離子)', color: '#fb923c', solutionColor: 'rgba(251,146,60,0.4)' },
    { id: 'Na+', label: 'Na⁺ (鈉離子)', color: '#e5e7eb', solutionColor: 'rgba(229,231,235,0.05)' },
];

const ANIONS = [
    { id: 'Cl-', label: 'Cl⁻ (氯離子)', color: '#bef264', solutionColor: 'rgba(190,242,100,0.1)' },
    { id: 'I-', label: 'I⁻ (碘離子)', color: '#fde047', solutionColor: 'rgba(253,224,71,0.15)' },
    { id: 'SO42-', label: 'SO₄²⁻ (硫酸根)', color: '#fbcfe8', solutionColor: 'rgba(251,207,232,0.1)' },
    { id: 'CO32-', label: 'CO₃²⁻ (碳酸根)', color: '#cbd5e1', solutionColor: 'rgba(203,213,225,0.1)' },
    { id: 'OH-', label: 'OH⁻ (氫氧根)', color: '#a5b4fc', solutionColor: 'rgba(165,180,252,0.1)' },
    { id: 'S2-', label: 'S²⁻ (硫離子)', color: '#fcd34d', solutionColor: 'rgba(252,211,77,0.15)' },
    { id: 'NO3-', label: 'NO₃⁻ (硝酸根)', color: '#e2e8f0', solutionColor: 'rgba(226,232,240,0.1)' },
];

type ResultData = { text: string; pptColor?: string | null; soluble: boolean };

const getReactionResult = (cation: string, anion: string): ResultData => {
    let soluble = true;
    let text = '無沉澱反應';
    let pptColor = null;

    if (anion === 'NO3-') return { text: '無沉澱反應 (皆可溶)', soluble: true };
    if (cation === 'Na+') return { text: '無沉澱反應 (皆可溶)', soluble: true };

    if (anion === 'Cl-') {
        if (cation === 'Ag+') { soluble = false; text = 'AgCl (白色沉澱)'; pptColor = 'rgba(255, 255, 255, 0.95)'; }
        if (cation === 'Pb2+') { soluble = false; text = 'PbCl₂ (白色沉澱)'; pptColor = 'rgba(240, 240, 240, 0.95)'; }
    }
    if (anion === 'I-') {
        if (cation === 'Ag+') { soluble = false; text = 'AgI (黃色沉澱)'; pptColor = 'rgba(253, 224, 71, 0.95)'; }
        if (cation === 'Pb2+') { soluble = false; text = 'PbI₂ (黃色沉澱)'; pptColor = 'rgba(250, 204, 21, 0.95)'; }
        if (cation === 'Cu2+') { soluble = false; text = 'CuI (白色沉澱) + I₂'; pptColor = 'rgba(230, 230, 230, 0.95)'; }
    }
    if (anion === 'SO42-') {
        if (cation === 'Pb2+') { soluble = false; text = 'PbSO₄ (白色沉澱)'; pptColor = 'rgba(255, 255, 255, 0.95)'; }
        if (cation === 'Ba2+') { soluble = false; text = 'BaSO₄ (白色沉澱)'; pptColor = 'rgba(255, 255, 255, 0.95)'; }
        if (cation === 'Ca2+') { soluble = false; text = 'CaSO₄ (微溶白色沉澱)'; pptColor = 'rgba(255, 255, 255, 0.7)'; }
        if (cation === 'Ag+') { soluble = false; text = 'Ag₂SO₄ (微溶白色沉澱)'; pptColor = 'rgba(255, 255, 255, 0.7)'; }
    }
    if (anion === 'CO32-') {
        if (['Ag+', 'Pb2+', 'Ba2+', 'Ca2+', 'Cu2+', 'Fe3+'].includes(cation)) {
            soluble = false;
            pptColor = 'rgba(255, 255, 255, 0.95)';
            if (cation === 'Ag+') { text = 'Ag₂CO₃ (微黃/白色沉澱)'; pptColor = 'rgba(254, 240, 138, 0.9)'; }
            else if (cation === 'Cu2+') { text = 'CuCO₃ (藍綠色沉澱)'; pptColor = 'rgba(45, 212, 191, 0.95)'; }
            else if (cation === 'Fe3+') { text = '產生 Fe(OH)₃ 沈澱'; pptColor = 'rgba(180, 83, 9, 0.95)'; }
            else text = `${cation.replace('2+', '')}CO₃ (白色沉澱)`;
        }
    }
    if (anion === 'OH-') {
        if (['Ag+', 'Pb2+', 'Cu2+', 'Fe3+'].includes(cation)) {
            soluble = false;
            if (cation === 'Ag+') { text = 'Ag₂O (棕黑色沉澱)'; pptColor = 'rgba(63, 39, 18, 0.95)'; }
            else if (cation === 'Pb2+') { text = 'Pb(OH)₂ (白色沉澱)'; pptColor = 'rgba(255, 255, 255, 0.95)'; }
            else if (cation === 'Cu2+') { text = 'Cu(OH)₂ (淺藍色沉澱)'; pptColor = 'rgba(96, 165, 250, 0.95)'; }
            else if (cation === 'Fe3+') { text = 'Fe(OH)₃ (紅褐色沉澱)'; pptColor = 'rgba(153, 27, 27, 0.95)'; }
        }
    }
    if (anion === 'S2-') {
        if (['Ag+', 'Pb2+', 'Cu2+', 'Fe3+'].includes(cation)) {
            soluble = false;
            if (cation === 'Fe3+') { text = 'Fe₂S₃ 或 FeS+S (黑色沉澱)'; pptColor = 'rgba(30, 41, 59, 0.95)'; }
            else {
                text = cation === 'Ag+' ? 'Ag₂S (黑色沉澱)' : `${cation.replace('2+', '').replace('+', '')}S (黑色沉澱)`;
                pptColor = 'rgba(15, 23, 42, 0.95)';
            }
        }
    }

    return { text, pptColor, soluble };
};

const FlaskIcon = ({ color, pptColor, isMixed = false }: { color: string, pptColor?: string | null, isMixed?: boolean }) => {
    const clipId = useId().replace(/:/g, ""); // replace colons to ensure a valid DOM ID
    return (
        <div className="relative w-32 h-40">
            <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <defs>
                    <clipPath id={clipId}>
                        <path d="M 40 40 L 60 40 L 76 90 A 5 5 0 0 1 70 100 L 30 100 A 5 5 0 0 1 24 90 Z" />
                    </clipPath>
                    <filter id={`${clipId}-blur`}>
                        <feGaussianBlur stdDeviation="3" />
                    </filter>
                </defs>

                {/* Liquid Area */}
                <path d="M 40 40 L 60 40 L 76 90 A 5 5 0 0 1 70 100 L 30 100 A 5 5 0 0 1 24 90 Z" fill={color} />
                
                {/* Precipitate sediment clipped by the liquid path */}
                {isMixed && pptColor && (
                    <g clipPath={`url(#${clipId})`}>
                        <motion.rect 
                            x="10" 
                            y="75" 
                            width="80" 
                            height="40" 
                            fill={pptColor} 
                            initial={{ opacity: 0, y: -20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            filter={`url(#${clipId}-blur)`}
                        />
                    </g>
                )}

                {/* Flask Glass Outline & Top Lip (Drawn over liquid for realistic reflection) */}
                <path d="M 40 10 L 60 10 L 60 40 L 80 100 A 10 10 0 0 1 70 110 L 30 110 A 10 10 0 0 1 20 100 L 40 40 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinejoin="round" />
                <path d="M 37 10 L 63 10" stroke="rgba(255,255,255,0.6)" strokeWidth="4" strokeLinecap="round" />
            </svg>
        </div>
    );
};

export default function PrecipitationLabView({ onBack }: PrecipitationLabViewProps) {
    const [cationId, setCationId] = useState<string>('Ag+');
    const [anionId, setAnionId] = useState<string>('Cl-');
    const [isReacting, setIsReacting] = useState(false);
    const [reactionComplete, setReactionComplete] = useState(false);

    const activeCation = useMemo(() => CATIONS.find(c => c.id === cationId)!, [cationId]);
    const activeAnion = useMemo(() => ANIONS.find(a => a.id === anionId)!, [anionId]);

    const result = useMemo(() => getReactionResult(cationId, anionId), [cationId, anionId]);

    const handleMix = () => {
        if (isReacting) return;
        setIsReacting(true);
        setReactionComplete(false);
        setTimeout(() => {
            setReactionComplete(true);
            setIsReacting(false);
        }, 2000);
    };

    const handleReset = () => {
        setReactionComplete(false);
    };

    // Calculate a blended color for the mixed solution
    const mixedSolutionColor = useMemo(() => {
        if (!reactionComplete) return 'transparent'; // Won't show anyway
        // Simplistic alpha blend or just taking one that is not white
        return activeCation.solutionColor !== 'rgba(255,255,255,0.1)' && activeCation.solutionColor !== 'rgba(229,231,235,0.05)'
             ? activeCation.solutionColor 
             : activeAnion.solutionColor;
    }, [activeCation, activeAnion, reactionComplete]);

    return (
        <main className="flex-1 w-full flex flex-col relative overflow-hidden" aria-labelledby="precip-heading">
            <div className="absolute inset-0 bg-[#001015]" aria-hidden="true"></div>
            <div className="scanlines" aria-hidden="true"></div>
            
            <header className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 glass-panel shrink-0 relative z-10">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack} 
                        aria-label="返回" 
                        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff] px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[#00f0ff] font-bold hover:bg-white/10 transition-colors shadow-sm font-mono"
                    >
                        ⬅ 返回
                    </button>
                    <div>
                        <h2 id="precip-heading" className="text-xl md:text-2xl font-black text-[#00f0ff] tracking-widest glowing-text">沉澱實驗室</h2>
                        <p className="text-xs text-white/60 font-mono">探索常見離子的沉澱反應與顏色變化</p>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-4 md:p-6 relative z-10 flex flex-col">
                <div className="min-w-[800px] max-w-5xl mx-auto w-full flex-1 flex flex-row gap-8 items-center justify-center">
                    
                    {/* Cation Flask */}
                    <div className="flex flex-col items-center gap-4 md:gap-6 glass-panel p-6 md:p-8 rounded-2xl w-full max-w-[280px] md:max-w-sm">
                        <h3 className="text-[#00f0ff] font-bold text-lg tracking-widest font-mono border-b border-[#00f0ff]/30 pb-2 w-full text-center">陽離子溶液</h3>
                        
                        <div className="relative z-30">
                            <motion.div 
                                animate={isReacting ? { x: 200, y: -80, rotate: 60 } : { x: 0, y: 0, rotate: 0 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            >
                                <FlaskIcon color={isReacting || reactionComplete ? 'transparent' : activeCation.solutionColor} />
                                {isReacting && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 120 }}
                                        transition={{ delay: 0.7, duration: 0.6 }}
                                        className="absolute top-[20%] left-[85%] w-2 rounded-full origin-top"
                                        style={{ backgroundColor: activeCation.solutionColor, transform: 'rotate(-60deg)', zIndex: -1 }}
                                    />
                                )}
                            </motion.div>
                        </div>
                        
                        <div className="w-full flex-col flex gap-2">
                            <label className="text-xs text-white/50 font-mono text-center">選擇陽離子</label>
                            <select 
                                value={cationId} 
                                onChange={(e) => { setCationId(e.target.value); handleReset(); }}
                                className="bg-black/50 border border-white/20 text-white rounded-lg p-2 focus:outline-none focus:border-[#00f0ff] font-mono w-full"
                                disabled={isReacting}
                            >
                                {CATIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Middle Section: Mix Button & Result Flask */}
                    <div className="flex flex-col items-center justify-center min-w-[200px] min-h-[350px] relative">
                        
                        {/* Always show middle flask */}
                        <motion.div 
                            className="flex flex-col items-center justify-center mb-8"
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                        >
                            <FlaskIcon 
                                color={reactionComplete ? mixedSolutionColor : 'transparent'} 
                                pptColor={reactionComplete ? result.pptColor : null} 
                                isMixed={reactionComplete} 
                            />
                        </motion.div>

                        <div className="absolute top-[200px] flex flex-col items-center w-full z-20">
                            {!reactionComplete && !isReacting && (
                                <button 
                                    onClick={handleMix}
                                    className="px-8 py-4 rounded-full bg-[#00f0ff]/20 border-2 border-[#00f0ff] text-[#00f0ff] font-bold text-xl hover:bg-[#00f0ff]/30 hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                                >
                                    混合
                                </button>
                            )}
                            
                            {isReacting && (
                                <div className="text-[#00f0ff] font-mono animate-pulse text-lg tracking-widest bg-black/50 px-4 py-2 rounded-lg">
                                    反應中...
                                </div>
                            )}

                            {reactionComplete && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center gap-4 w-full px-4"
                                >
                                    <div className={`w-full px-4 py-2 border rounded-lg font-bold font-mono text-center shadow-lg ${result.soluble ? 'bg-green-500/20 border-green-400 text-green-300' : 'bg-orange-500/20 border-orange-400 text-orange-300'}`}>
                                        {result.text}
                                    </div>
                                    <button 
                                        onClick={handleReset}
                                        className="text-white/50 hover:text-white underline text-sm transition-colors"
                                    >
                                        重置
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Anion Flask */}
                    <div className="flex flex-col items-center gap-4 md:gap-6 glass-panel p-6 md:p-8 rounded-2xl w-full max-w-[280px] md:max-w-sm">
                        <h3 className="text-[#ff00ff] font-bold text-lg tracking-widest font-mono border-b border-[#ff00ff]/30 pb-2 w-full text-center">陰離子溶液</h3>
                        
                        <div className="relative z-30">
                            <motion.div 
                                animate={isReacting ? { x: -200, y: -80, rotate: -60 } : { x: 0, y: 0, rotate: 0 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            >
                                <FlaskIcon color={isReacting || reactionComplete ? 'transparent' : activeAnion.solutionColor} />
                                {isReacting && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 120 }}
                                        transition={{ delay: 0.7, duration: 0.6 }}
                                        className="absolute top-[20%] right-[85%] w-2 rounded-full origin-top"
                                        style={{ backgroundColor: activeAnion.solutionColor, transform: 'rotate(60deg)', zIndex: -1 }}
                                    />
                                )}
                            </motion.div>
                        </div>

                        <div className="w-full flex-col flex gap-2">
                            <label className="text-xs text-white/50 font-mono text-center">選擇陰離子</label>
                            <select 
                                value={anionId} 
                                onChange={(e) => { setAnionId(e.target.value); handleReset(); }}
                                className="bg-black/50 border border-white/20 text-white rounded-lg p-2 focus:outline-none focus:border-[#ff00ff] font-mono w-full"
                                disabled={isReacting}
                            >
                                {ANIONS.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                            </select>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}

