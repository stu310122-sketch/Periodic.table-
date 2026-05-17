import React, { useState } from 'react';
import { ElementData } from '../data';
import AtomicPackingView from './AtomicPackingView';
import DigitalLabView from './DigitalLabView';
import PrecipitationLabView from './PrecipitationLabView';

interface VisualizationsViewProps {
    elements: ElementData[];
    onBack: () => void;
}

export function VisualizationsView({ elements, onBack }: VisualizationsViewProps) {
    const [selectedVis, setSelectedVis] = useState<string | null>(null);

    const visualizations = [
        { 
            id: 'atomic-packing', 
            title: '原子堆積模型', 
            description: '探索元素在不同晶格結構中的立體排列方式。支援旋轉與縮放互動。', 
            icon: '🧊', 
            color: 'text-blue-400',
            glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)] border-blue-500/30 group-hover:border-blue-400 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]'
        },
        { 
            id: 'digital-lab', 
            title: '數位模擬實驗室', 
            description: '手動輸入數據進行實驗室基礎運算與模擬，如理想氣體、稀釋等。', 
            icon: '⚗️', 
            color: 'text-green-400',
            glow: 'shadow-[0_0_20px_rgba(74,222,128,0.3)] border-green-500/30 group-hover:border-green-400 group-hover:shadow-[0_0_30px_rgba(74,222,128,0.6)]'
        },
        {
            id: 'precipitation-lab',
            title: '沉澱實驗室',
            description: '選擇不同陽離子與陰離子，即時觀察沉澱反應與顏色變化。',
            icon: '🧪',
            color: 'text-fuchsia-400',
            glow: 'shadow-[0_0_20px_rgba(232,121,249,0.3)] border-fuchsia-500/30 group-hover:border-fuchsia-400 group-hover:shadow-[0_0_30px_rgba(232,121,249,0.6)]'
        }
    ];

    if (selectedVis === 'atomic-packing') {
        return <AtomicPackingView onBack={() => setSelectedVis(null)} />;
    }
    
    if (selectedVis === 'digital-lab') {
        return <DigitalLabView onBack={() => setSelectedVis(null)} />;
    }

    if (selectedVis === 'precipitation-lab') {
        return <PrecipitationLabView onBack={() => setSelectedVis(null)} />;
    }

    return (
        <main className="flex-1 w-full flex flex-col relative overflow-hidden" aria-labelledby="visualizations-heading">
            <div className="scanlines" aria-hidden="true"></div>
            
            <header className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 glass-panel shrink-0 relative z-10">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack} 
                        aria-label="返回首頁" 
                        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff] px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[#00f0ff] font-bold hover:bg-white/10 transition-colors shadow-sm font-mono"
                    >
                        ⬅ 回首頁
                    </button>
                    <div>
                        <h2 id="visualizations-heading" className="text-xl md:text-2xl font-black text-white tracking-widest glowing-text">數據虛擬實驗室</h2>
                        <p className="text-xs text-[#a5f3fc] font-mono whitespace-pre-line">選擇並探索不同的科學數據視圖</p>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative z-10">
                <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visualizations.map(vis => (
                        <button
                            key={vis.id}
                            onClick={() => setSelectedVis(vis.id)}
                            className={`glass-panel border p-8 flex flex-col items-center justify-center text-center cursor-pointer min-h-[300px] rounded-2xl group transition-all duration-300 ${vis.glow}`}
                        >
                            <div className={`text-7xl mb-6 group-hover:scale-110 transition-transform ${vis.color}`}>{vis.icon}</div>
                            <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">{vis.title}</h3>
                            <p className="text-cyan-100/70 font-mono text-sm leading-relaxed">{vis.description}</p>
                            
                            <div className="mt-8 px-6 py-2 rounded-full border border-white/20 text-white/80 font-mono text-xs uppercase tracking-widest group-hover:bg-white/10 group-hover:text-white transition-colors">
                                進入模型 ➔
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </main>
    );
}

