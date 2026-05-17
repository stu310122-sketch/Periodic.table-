import React, { useState, useEffect } from 'react';

interface DigitalLabViewProps {
    onBack: () => void;
}

export default function DigitalLabView({ onBack }: DigitalLabViewProps) {
    const [activeTab, setActiveTab] = useState<'gas' | 'dilution' | 'titration' | 'redox'>('gas');

    // Gas Law State (PV = nRT, R = 0.082)
    const [pressure, setPressure] = useState<string>('1'); // atm
    const [volume, setVolume] = useState<string>('22.4'); // L
    const [moles, setMoles] = useState<string>('1'); // mol
    const [temperature, setTemperature] = useState<string>('273.15'); // K
    const [solveFor, setSolveFor] = useState<'P' | 'V' | 'n' | 'T'>('V');

    // Dilution State (M1V1 = M2V2)
    const [m1, setM1] = useState<string>('1');
    const [v1, setV1] = useState<string>('100');
    const [m2, setM2] = useState<string>('0.5');
    const [v2, setV2] = useState<string>('200');
    const [solveForDilution, setSolveForDilution] = useState<'M1' | 'V1' | 'M2' | 'V2'>('V2');

    // Titration State (CaVa*a = CbVb*b)
    const [ca, setCa] = useState<string>('0.1'); // M
    const [va, setVa] = useState<string>('50'); // mL
    const [aFactor, setAFactor] = useState<string>('1'); // valency
    const [cb, setCb] = useState<string>('0.2'); // M
    const [vb, setVb] = useState<string>('25'); // mL
    const [bFactor, setBFactor] = useState<string>('1'); // valency
    const [solveForTitration, setSolveForTitration] = useState<'Ca' | 'Va' | 'Cb' | 'Vb'>('Va');

    // Redox State (CoxVox*eox = CredVred*ered)
    const [cox, setCox] = useState<string>('0.02');
    const [vox, setVox] = useState<string>('20');
    const [eox, setEox] = useState<string>('5'); // MnO4- -> Mn2+
    const [cred, setCred] = useState<string>('0.1');
    const [vred, setVred] = useState<string>('10');
    const [ered, setEred] = useState<string>('2'); // C2O4 2-
    const [solveForRedox, setSolveForRedox] = useState<'Cox' | 'Vox' | 'Cred' | 'Vred'>('Vox');

    // Gas Law Effect
    useEffect(() => {
        const p = parseFloat(pressure);
        const v = parseFloat(volume);
        const n = parseFloat(moles);
        const t = parseFloat(temperature);
        const R = 0.08206;

        if (solveFor === 'P' && v && n && t) {
            setPressure(((n * R * t) / v).toFixed(3));
        } else if (solveFor === 'V' && p && n && t) {
            setVolume(((n * R * t) / p).toFixed(3));
        } else if (solveFor === 'n' && p && v && t) {
            setMoles(((p * v) / (R * t)).toFixed(3));
        } else if (solveFor === 'T' && p && v && n) {
            setTemperature(((p * v) / (n * R)).toFixed(3));
        }
    }, [pressure, volume, moles, temperature, solveFor]);

    // Dilution Effect
    useEffect(() => {
        const c1 = parseFloat(m1);
        const vol1 = parseFloat(v1);
        const c2 = parseFloat(m2);
        const vol2 = parseFloat(v2);

        if (solveForDilution === 'M1' && vol1 && c2 && vol2) {
            setM1(((c2 * vol2) / vol1).toFixed(3));
        } else if (solveForDilution === 'V1' && c1 && c2 && vol2) {
            setV1(((c2 * vol2) / c1).toFixed(3));
        } else if (solveForDilution === 'M2' && c1 && vol1 && vol2) {
            setM2(((c1 * vol1) / vol2).toFixed(3));
        } else if (solveForDilution === 'V2' && c1 && vol1 && c2) {
            setV2(((c1 * vol1) / c2).toFixed(3));
        }
    }, [m1, v1, m2, v2, solveForDilution]);

    // Titration Effect
    useEffect(() => {
        const cac = parseFloat(ca);
        const vac = parseFloat(va);
        const af = parseFloat(aFactor);
        const cbc = parseFloat(cb);
        const vbc = parseFloat(vb);
        const bf = parseFloat(bFactor);

        if (solveForTitration === 'Ca' && vac && af && cbc && vbc && bf) {
            setCa(((cbc * vbc * bf) / (vac * af)).toFixed(3));
        } else if (solveForTitration === 'Va' && cac && af && cbc && vbc && bf) {
            setVa(((cbc * vbc * bf) / (cac * af)).toFixed(3));
        } else if (solveForTitration === 'Cb' && cac && vac && af && vbc && bf) {
            setCb(((cac * vac * af) / (vbc * bf)).toFixed(3));
        } else if (solveForTitration === 'Vb' && cac && vac && af && cbc && bf) {
            setVb(((cac * vac * af) / (cbc * bf)).toFixed(3));
        }
    }, [ca, va, aFactor, cb, vb, bFactor, solveForTitration]);

    // Redox Effect
    useEffect(() => {
        const coxc = parseFloat(cox);
        const voxc = parseFloat(vox);
        const eoxc = parseFloat(eox);
        const credc = parseFloat(cred);
        const vredc = parseFloat(vred);
        const eredc = parseFloat(ered);

        if (solveForRedox === 'Cox' && voxc && eoxc && credc && vredc && eredc) {
            setCox(((credc * vredc * eredc) / (voxc * eoxc)).toFixed(4));
        } else if (solveForRedox === 'Vox' && coxc && eoxc && credc && vredc && eredc) {
            setVox(((credc * vredc * eredc) / (coxc * eoxc)).toFixed(3));
        } else if (solveForRedox === 'Cred' && coxc && voxc && eoxc && vredc && eredc) {
            setCred(((coxc * voxc * eoxc) / (vredc * eredc)).toFixed(4));
        } else if (solveForRedox === 'Vred' && coxc && voxc && eoxc && credc && eredc) {
            setVred(((coxc * voxc * eoxc) / (credc * eredc)).toFixed(3));
        }
    }, [cox, vox, eox, cred, vred, ered, solveForRedox]);

    return (
        <main className="flex-1 w-full flex flex-col relative overflow-hidden" aria-labelledby="lab-heading">
            <div className="scanlines" aria-hidden="true"></div>
            
            <header className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 glass-panel shrink-0 relative z-10">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack} 
                        aria-label="返回" 
                        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff] px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[#00f0ff] font-bold hover:bg-white/10 transition-colors shadow-sm font-mono"
                    >
                        ⬅ 返回模型列表
                    </button>
                    <div>
                        <h2 id="lab-heading" className="text-xl md:text-2xl font-black text-white tracking-widest glowing-text">數位模擬實驗室</h2>
                        <p className="text-xs text-[#a5f3fc] font-mono">輸入數據即時模擬基礎化學計算</p>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative z-10">
                <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
                    
                    {/* Tabs */}
                    <div className="flex gap-4 border-b border-white/20 pb-4 overflow-x-auto custom-scrollbar">
                        <button 
                            className={`px-6 py-3 rounded-t-lg font-bold transition-colors whitespace-nowrap ${activeTab === 'gas' ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-b-2 border-[#00f0ff]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                            onClick={() => setActiveTab('gas')}
                        >
                            理想氣體方程
                        </button>
                        <button 
                            className={`px-6 py-3 rounded-t-lg font-bold transition-colors whitespace-nowrap ${activeTab === 'dilution' ? 'bg-[#33ff66]/20 text-[#33ff66] border-b-2 border-[#33ff66]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                            onClick={() => setActiveTab('dilution')}
                        >
                            溶液稀釋
                        </button>
                        <button 
                            className={`px-6 py-3 rounded-t-lg font-bold transition-colors whitespace-nowrap ${activeTab === 'titration' ? 'bg-[#ff33cc]/20 text-[#ff33cc] border-b-2 border-[#ff33cc]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                            onClick={() => setActiveTab('titration')}
                        >
                            酸鹼滴定
                        </button>
                        <button 
                            className={`px-6 py-3 rounded-t-lg font-bold transition-colors whitespace-nowrap ${activeTab === 'redox' ? 'bg-[#ff9933]/20 text-[#ff9933] border-b-2 border-[#ff9933]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                            onClick={() => setActiveTab('redox')}
                        >
                            氧化還原滴定
                        </button>
                    </div>

                    {/* Gas Lab */}
                    {activeTab === 'gas' && (
                        <div className="glass-panel p-8 rounded-2xl border border-white/10 animate-fade-in">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-[#00f0ff]">💨</span> 理想氣體狀態方程
                            </h3>
                            <div className="text-sm text-cyan-100/70 leading-relaxed mb-8 bg-[#00f0ff]/10 p-4 rounded-xl border border-[#00f0ff]/20">
                                <strong className="text-[#00f0ff]">📝 實驗原理：</strong>理想氣體方程式描述了處於平衡狀態的理想氣體之壓力、體積、莫耳數與溫度之間的狀態關聯。<br/>
                                <strong className="text-[#00f0ff]">💡 應用場景：</strong>計算氣體在特定環境下的物理量變化，如熱氣球升力、氣體鋼瓶容量評估等。<br/>
                                <strong className="text-[#00f0ff]">🔧 參數說明：</strong>P (壓力 atm)，V (體積 L)，n (氣體莫耳數 mol)，T (絕對溫度 K)。氣體常數 R ≈ 0.08206 (L·atm / mol·K)。
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                        <label className="block text-sm font-mono text-[#00f0ff] mb-2 uppercase tracking-wider">選擇欲求知的變數</label>
                                        <select 
                                            className="w-full bg-white/5 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-[#00f0ff]"
                                            value={solveFor}
                                            onChange={(e) => setSolveFor(e.target.value as any)}
                                        >
                                            <option value="P" className="bg-slate-900">壓力 (P)</option>
                                            <option value="V" className="bg-slate-900">體積 (V)</option>
                                            <option value="n" className="bg-slate-900">莫耳數 (n)</option>
                                            <option value="T" className="bg-slate-900">溫度 (T)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-4">
                                        <InputRow label="壓力 (P)" unit="atm" value={pressure} onChange={setPressure} disabled={solveFor === 'P'} color="cyan-400" />
                                        <InputRow label="體積 (V)" unit="L" value={volume} onChange={setVolume} disabled={solveFor === 'V'} color="cyan-400" />
                                        <InputRow label="莫耳數 (n)" unit="mol" value={moles} onChange={setMoles} disabled={solveFor === 'n'} color="cyan-400" />
                                        <InputRow label="溫度 (T)" unit="K" value={temperature} onChange={setTemperature} disabled={solveFor === 'T'} color="cyan-400" />
                                    </div>
                                    <p className="text-xs text-white/50 font-mono">* 氣體常數 R = 0.08206 L·atm/(mol·K)</p>
                                </div>

                                <div className="flex items-center justify-center bg-black/30 rounded-xl border border-white/10 p-8 relative overflow-hidden">
                                     <div className="absolute inset-0 pattern-grid opacity-20"></div>
                                     <div className="text-center z-10">
                                         <div className="text-6xl mb-4 animate-float">🎈</div>
                                         <div className="text-4xl font-mono font-bold text-white mb-2">
                                             {solveFor === 'P' && `${pressure} atm`}
                                             {solveFor === 'V' && `${volume} L`}
                                             {solveFor === 'n' && `${moles} mol`}
                                             {solveFor === 'T' && `${temperature} K`}
                                         </div>
                                         <div className="text-cyan-400/80 uppercase tracking-widest text-sm">
                                             計算結果 ({solveFor})
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Dilution Lab */}
                    {activeTab === 'dilution' && (
                        <div className="glass-panel p-8 rounded-2xl border border-white/10 animate-fade-in">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-[#33ff66]">💧</span> 溶液配製與稀釋
                            </h3>
                            <div className="text-sm text-green-100/70 leading-relaxed mb-8 bg-[#33ff66]/10 p-4 rounded-xl border border-[#33ff66]/20">
                                <strong className="text-[#33ff66]">📝 實驗原理：</strong>在稀釋過程中，溶質的總莫耳數保持不變。因此初始濃度與體積的乘積會等於最終濃度與體積的乘積。<br/>
                                <strong className="text-[#33ff66]">💡 應用場景：</strong>實驗室中常需要將高濃度的母液稀釋成各種較低濃度的標準溶液或工作溶液。<br/>
                                <strong className="text-[#33ff66]">🔧 參數說明：</strong>M₁ / M₂ (初始/最終之體積莫耳濃度 M)，V₁ / V₂ (初始/最終之溶液體積 mL)。
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                        <label className="block text-sm font-mono text-[#33ff66] mb-2 uppercase tracking-wider">選擇欲求知的變數</label>
                                        <select 
                                            className="w-full bg-white/5 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-[#33ff66]"
                                            value={solveForDilution}
                                            onChange={(e) => setSolveForDilution(e.target.value as any)}
                                        >
                                            <option value="M1" className="bg-slate-900">初始濃度 (M₁)</option>
                                            <option value="V1" className="bg-slate-900">初始體積 (V₁)</option>
                                            <option value="M2" className="bg-slate-900">最終濃度 (M₂)</option>
                                            <option value="V2" className="bg-slate-900">最終體積 (V₂)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="text-sm font-bold text-white/50 mb-2">初始狀態</div>
                                        <InputRow label="濃度 (M₁)" unit="M" value={m1} onChange={setM1} disabled={solveForDilution === 'M1'} color="green-400" />
                                        <InputRow label="體積 (V₁)" unit="mL" value={v1} onChange={setV1} disabled={solveForDilution === 'V1'} color="green-400" />
                                        
                                        <div className="text-sm font-bold text-white/50 mt-6 mb-2">最終狀態</div>
                                        <InputRow label="濃度 (M₂)" unit="M" value={m2} onChange={setM2} disabled={solveForDilution === 'M2'} color="green-400" />
                                        <InputRow label="體積 (V₂)" unit="mL" value={v2} onChange={setV2} disabled={solveForDilution === 'V2'} color="green-400" />
                                    </div>
                                    <p className="text-xs text-white/50 font-mono">* M₁V₁ = M₂V₂</p>
                                </div>

                                <div className="flex items-center justify-center bg-black/30 rounded-xl border border-white/10 p-8 relative overflow-hidden">
                                     <div className="absolute inset-0 pattern-grid opacity-20"></div>
                                     <div className="text-center z-10 flex flex-col items-center">
                                         <div className="flex gap-4 items-end mb-8">
                                            <div className="relative w-16 h-24 border-2 border-white/40 rounded-b-lg border-t-0 flex items-end justify-center">
                                                <div className="bg-[#33ff66]/40 w-full" style={{ height: `${Math.min(100, Math.max(10, (parseFloat(v1) / Math.max(parseFloat(v1), parseFloat(v2))) * 100))}%` }}></div>
                                                <span className="absolute -bottom-6 text-xs text-white/60">V₁ = {v1}</span>
                                            </div>
                                            <div className="text-2xl text-white/50">➔</div>
                                            <div className="relative w-24 h-32 border-2 border-white/40 rounded-b-lg border-t-0 flex items-end justify-center">
                                                <div className="bg-[#33ff66]/20 w-full" style={{ height: `${Math.min(100, Math.max(10, (parseFloat(v2) / Math.max(parseFloat(v1), parseFloat(v2))) * 100))}%` }}></div>
                                                <span className="absolute -bottom-6 text-xs text-white/60">V₂ = {v2}</span>
                                            </div>
                                         </div>

                                         <div className="text-4xl font-mono font-bold text-white mb-2">
                                             {solveForDilution === 'M1' && `${m1} M`}
                                             {solveForDilution === 'V1' && `${v1} mL`}
                                             {solveForDilution === 'M2' && `${m2} M`}
                                             {solveForDilution === 'V2' && `${v2} mL`}
                                         </div>
                                         <div className="text-[#33ff66]/80 uppercase tracking-widest text-sm">
                                             計算結果 ({solveForDilution})
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Titration Lab */}
                    {activeTab === 'titration' && (
                        <div className="glass-panel p-8 rounded-2xl border border-white/10 animate-fade-in">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-[#ff33cc]">🧪</span> 酸鹼滴定
                            </h3>
                            <div className="text-sm text-fuchsia-100/70 leading-relaxed mb-8 bg-[#ff33cc]/10 p-4 rounded-xl border border-[#ff33cc]/20">
                                <strong className="text-[#ff33cc]">📝 實驗原理：</strong>酸鹼中和到當量點時，酸解離出的氫離子 (H⁺) 莫耳數等於鹼解離出的氫氧根離子 (OH⁻) 莫耳數。<br/>
                                <strong className="text-[#ff33cc]">💡 應用場景：</strong>用已知濃度的標準酸(或鹼)溶液來滴定未知濃度的鹼(或酸)溶液，藉此分析其濃度。<br/>
                                <strong className="text-[#ff33cc]">🔧 參數說明：</strong>Cₐ / C₆ (酸/鹼濃度 M)，Vₐ / V₆ (酸/鹼體積 mL)。a 為酸的質子數 (如 H₂SO₄ a=2)，b 為鹼的氫氧根數 (如 NaOH b=1)。
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                        <label className="block text-sm font-mono text-[#ff33cc] mb-2 uppercase tracking-wider">選擇欲求知的變數</label>
                                        <select 
                                            className="w-full bg-white/5 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-[#ff33cc]"
                                            value={solveForTitration}
                                            onChange={(e) => setSolveForTitration(e.target.value as any)}
                                        >
                                            <option value="Ca" className="bg-slate-900">酸濃度 (Cₐ)</option>
                                            <option value="Va" className="bg-slate-900">酸體積 (Vₐ)</option>
                                            <option value="Cb" className="bg-slate-900">鹼濃度 (C₆)</option>
                                            <option value="Vb" className="bg-slate-900">鹼體積 (V₆)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="text-sm font-bold text-white/50 mb-2">酸 (Acid)</div>
                                        <InputRow label="濃度 (Cₐ)" unit="M" value={ca} onChange={setCa} disabled={solveForTitration === 'Ca'} color="fuchsia-400" />
                                        <InputRow label="體積 (Vₐ)" unit="mL" value={va} onChange={setVa} disabled={solveForTitration === 'Va'} color="fuchsia-400" />
                                        <InputRow label="質子數 (a)" unit="eq" value={aFactor} onChange={setAFactor} color="fuchsia-400" />
                                        
                                        <div className="text-sm font-bold text-white/50 mt-6 mb-2">鹼 (Base)</div>
                                        <InputRow label="濃度 (C₆)" unit="M" value={cb} onChange={setCb} disabled={solveForTitration === 'Cb'} color="fuchsia-400" />
                                        <InputRow label="體積 (V₆)" unit="mL" value={vb} onChange={setVb} disabled={solveForTitration === 'Vb'} color="fuchsia-400" />
                                        <InputRow label="氫氧根數 (b)" unit="eq" value={bFactor} onChange={setBFactor} color="fuchsia-400" />
                                    </div>
                                    <p className="text-xs text-white/50 font-mono">* 當量點：Cₐ · Vₐ · a = C₆ · V₆ · b</p>
                                </div>

                                <div className="flex items-center justify-center bg-black/30 rounded-xl border border-white/10 p-8 relative overflow-hidden">
                                     <div className="absolute inset-0 pattern-grid opacity-20"></div>
                                     <div className="text-center z-10 flex flex-col items-center">
                                         <div className="text-6xl mb-4 animate-bounce-slight">⚗️</div>
                                         <div className="text-4xl font-mono font-bold text-white mb-2">
                                             {solveForTitration === 'Ca' && `${ca} M`}
                                             {solveForTitration === 'Va' && `${va} mL`}
                                             {solveForTitration === 'Cb' && `${cb} M`}
                                             {solveForTitration === 'Vb' && `${vb} mL`}
                                         </div>
                                         <div className="text-[#ff33cc]/80 uppercase tracking-widest text-sm">
                                             計算結果 ({solveForTitration})
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Redox Lab */}
                    {activeTab === 'redox' && (
                        <div className="glass-panel p-8 rounded-2xl border border-white/10 animate-fade-in">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-[#ff9933]">⚡</span> 氧化還原滴定
                            </h3>
                            <div className="text-sm text-orange-100/70 leading-relaxed mb-8 bg-[#ff9933]/10 p-4 rounded-xl border border-[#ff9933]/20">
                                <strong className="text-[#ff9933]">📝 實驗原理：</strong>氧化還原反應達到當量點時，氧化劑獲得的總電子莫耳數等於還原劑失去的總電子莫耳數。<br/>
                                <strong className="text-[#ff9933]">💡 應用場景：</strong>例如以過錳酸鉀 (KMnO₄) 滴定未知濃度的草酸或鐵鹽，用於測定水質或其他化學成分的含量。<br/>
                                <strong className="text-[#ff9933]">🔧 參數說明：</strong>C_ox / C_red (氧化劑/還原劑濃度 M)，V_ox / V_red (所用體積 mL)。轉換電子數為半反應中得失的電子數 (如 MnO₄⁻ 變 Mn²⁺ 為 5 顆)。
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                        <label className="block text-sm font-mono text-[#ff9933] mb-2 uppercase tracking-wider">選擇欲求知的變數</label>
                                        <select 
                                            className="w-full bg-white/5 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-[#ff9933]"
                                            value={solveForRedox}
                                            onChange={(e) => setSolveForRedox(e.target.value as any)}
                                        >
                                            <option value="Cox" className="bg-slate-900">氧化劑濃度 (C_ox)</option>
                                            <option value="Vox" className="bg-slate-900">氧化劑體積 (V_ox)</option>
                                            <option value="Cred" className="bg-slate-900">還原劑濃度 (C_red)</option>
                                            <option value="Vred" className="bg-slate-900">還原劑體積 (V_red)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="text-sm font-bold text-white/50 mb-2">氧化劑 (Oxidizing Agent)</div>
                                        <InputRow label="濃度 (C_ox)" unit="M" value={cox} onChange={setCox} disabled={solveForRedox === 'Cox'} color="orange-400" />
                                        <InputRow label="體積 (V_ox)" unit="mL" value={vox} onChange={setVox} disabled={solveForRedox === 'Vox'} color="orange-400" />
                                        <InputRow label="轉換電子數" unit="e⁻" value={eox} onChange={setEox} color="orange-400" />
                                        
                                        <div className="text-sm font-bold text-white/50 mt-6 mb-2">還原劑 (Reducing Agent)</div>
                                        <InputRow label="濃度 (C_red)" unit="M" value={cred} onChange={setCred} disabled={solveForRedox === 'Cred'} color="orange-400" />
                                        <InputRow label="體積 (V_red)" unit="mL" value={vred} onChange={setVred} disabled={solveForRedox === 'Vred'} color="orange-400" />
                                        <InputRow label="轉換電子數" unit="e⁻" value={ered} onChange={setEred} color="orange-400" />
                                    </div>
                                    <p className="text-xs text-white/50 font-mono">* 當量點：C_ox · V_ox · e_ox = C_red · V_red · e_red</p>
                                </div>

                                <div className="flex items-center justify-center bg-black/30 rounded-xl border border-white/10 p-8 relative overflow-hidden">
                                     <div className="absolute inset-0 pattern-grid opacity-20"></div>
                                     <div className="text-center z-10 flex flex-col items-center">
                                         <div className="text-6xl mb-4 animate-float text-orange-400" style={{ animationDuration: '3s' }}>⚗️</div>
                                         <div className="text-4xl font-mono font-bold text-white mb-2">
                                             {solveForRedox === 'Cox' && `${cox} M`}
                                             {solveForRedox === 'Vox' && `${vox} mL`}
                                             {solveForRedox === 'Cred' && `${cred} M`}
                                             {solveForRedox === 'Vred' && `${vred} mL`}
                                         </div>
                                         <div className="text-[#ff9933]/80 uppercase tracking-widest text-sm">
                                             計算結果 ({solveForRedox})
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </main>
    );
}

function InputRow({ label, unit, value, onChange, disabled, color }: { label: string, unit: string, value: string, onChange: (v: string) => void, disabled?: boolean, color: string }) {
    return (
        <div className="flex items-center gap-4">
            <span className={`w-24 text-sm font-bold ${disabled ? 'text-white/40' : 'text-white'}`}>{label}</span>
            <input 
                type="number" 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`flex-1 bg-black/50 border rounded-lg px-4 py-2 font-mono text-lg
                    ${disabled 
                        ? `border-${color}/50 text-${color} bg-${color}/10 font-bold shadow-[0_0_10px_rgba(var(--tw-colors-${color}),0.2)]` 
                        : 'border-white/20 text-white focus:border-white/60 focus:outline-none'
                    }
                `}
            />
            <span className="w-12 text-sm text-white/50 font-mono">{unit}</span>
        </div>
    );
}
