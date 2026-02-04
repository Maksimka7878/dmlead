import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const TestPacket: React.FC = () => {
  return (
    <div className="group relative w-full mt-8">
      {/* Dynamic Glow behind */}
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2.5rem] blur-xl opacity-40 group-hover:opacity-60 transition duration-700 group-hover:blur-2xl"></div>
      
      {/* Main Container - Liquid Glass Style */}
      <div className="relative bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2rem] p-8 md:p-12 overflow-hidden text-white shadow-2xl transform transition-all hover:scale-[1.01] border border-white/20">
        
        {/* Liquid Sheen Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none"></div>
        <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-b from-white/5 to-transparent rotate-45 pointer-events-none"></div>
        
        {/* Floating Orbs inside */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/30 rounded-full blur-[80px] -mr-32 -mt-32 mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-[60px] -ml-20 -mb-20 mix-blend-screen pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-indigo-50 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md mb-8 shadow-inner box-border">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    Special Offer
                </div>

                <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-200 mb-6 drop-shadow-sm">
                    Тестовый пакет
                </h3>
                
                <p className="text-indigo-100 text-lg md:text-xl mb-10 leading-relaxed max-w-lg font-light">
                    Идеально для проверки качества. <br/>
                    <span className="font-bold text-white bg-white/10 px-3 py-1 rounded-lg mx-1 whitespace-nowrap border border-white/10 shadow-sm backdrop-blur-sm">5 лидов бизнес-класса</span> 
                    по новостройкам Москвы.
                </p>

                <div className="flex flex-wrap gap-4 mb-8 md:mb-0">
                    <div className="bg-black/20 backdrop-blur-md rounded-2xl p-5 min-w-[120px] text-center border border-white/10 shadow-lg relative overflow-hidden">
                         <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                        <div className="text-xs text-indigo-200 uppercase tracking-widest mb-2 opacity-80 font-bold">Объем</div>
                        <div className="font-black text-white text-3xl leading-none tracking-tight">5 шт</div>
                    </div>
                    <div className="bg-black/20 backdrop-blur-md rounded-2xl p-5 min-w-[120px] text-center border border-white/10 shadow-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                        <div className="text-xs text-indigo-200 uppercase tracking-widest mb-2 opacity-80 font-bold">Гео</div>
                        <div className="font-black text-white text-3xl leading-none tracking-tight">МСК</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-8 min-w-[280px] bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
                <div className="text-center md:text-right w-full">
                    <div className="text-lg text-indigo-300 line-through font-medium mb-2 decoration-indigo-400/50">25 000 ₽</div>
                    <div className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">10 000 ₽</div>
                </div>

                <a 
                    href="https://t.me/DMitryLeads" 
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-3 w-full bg-white text-violet-700 font-bold text-xl py-5 px-8 rounded-2xl hover:bg-indigo-50 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1 active:scale-95 group/btn"
                >
                    Забрать тест <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TestPacket;