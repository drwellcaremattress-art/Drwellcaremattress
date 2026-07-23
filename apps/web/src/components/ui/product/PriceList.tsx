import React from 'react';

export function PriceList() {
  return (
    <section className="bg-white rounded-3xl p-6 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-16 mt-8">
      <div className="flex justify-center items-center mb-10 relative">
        <div className="absolute w-full h-0.5 bg-green-700/30 z-0 hidden md:block"></div>
        <div className="relative z-10 bg-[#0B1A2A] text-white px-6 md:px-10 py-3 rounded-xl font-heading text-2xl md:text-3xl font-extrabold tracking-widest shadow-lg border-2 border-white flex items-center gap-4 text-center">
          <span className="text-[#7cb93e] text-xl md:text-2xl hidden md:inline">◀</span>
          PRICE LIST <span className="text-lg md:text-xl font-medium tracking-normal whitespace-nowrap">(Per Sq.Ft)</span>
          <span className="text-[#7cb93e] text-xl md:text-2xl hidden md:inline">▶</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* SINGLE */}
        <div className="flex flex-col rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
          <div className="bg-[#055bc7] text-white py-4 px-2 flex items-center justify-center gap-3 font-heading text-xl font-bold tracking-widest">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8"/><path d="M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/><path d="M3 18h18"/></svg>
            SINGLE
          </div>
          <div className="grid grid-cols-3 bg-gray-50 text-[10px] md:text-[11px] font-bold text-gray-700 uppercase text-center border-b border-gray-200 py-3">
            <div>SIZE<br/>(INCHES)</div>
            <div className="flex items-center justify-center border-l border-r border-gray-200">SQ.FT.</div>
            <div className="flex items-center justify-center">PRICE (₹)</div>
          </div>
          <div className="flex flex-col text-sm font-semibold text-center divide-y divide-gray-100">
            <div className="grid grid-cols-3 py-3 hover:bg-blue-50/50 transition-colors">
              <div className="text-gray-800">72&quot; × 30&quot;</div>
              <div className="text-gray-600 border-l border-r border-gray-100 flex items-center justify-center">15.00</div>
              <div className="text-[#055bc7]">₹ 8,190</div>
            </div>
            <div className="grid grid-cols-3 py-3 hover:bg-blue-50/50 transition-colors">
              <div className="text-gray-800">75&quot; × 30&quot;</div>
              <div className="text-gray-600 border-l border-r border-gray-100 flex items-center justify-center">15.63</div>
              <div className="text-[#055bc7]">₹ 8,526</div>
            </div>
            <div className="grid grid-cols-3 py-3 hover:bg-blue-50/50 transition-colors">
              <div className="text-gray-800">72&quot; × 36&quot;</div>
              <div className="text-gray-600 border-l border-r border-gray-100 flex items-center justify-center">18.00</div>
              <div className="text-[#055bc7]">₹ 9,828</div>
            </div>
            <div className="grid grid-cols-3 py-3 hover:bg-blue-50/50 transition-colors">
              <div className="text-gray-800">75&quot; × 36&quot;</div>
              <div className="text-gray-600 border-l border-r border-gray-100 flex items-center justify-center">18.75</div>
              <div className="text-[#055bc7]">₹ 10,237</div>
            </div>
            <div className="grid grid-cols-3 py-3 hover:bg-blue-50/50 transition-colors">
              <div className="text-gray-800">78&quot; × 36&quot;</div>
              <div className="text-gray-600 border-l border-r border-gray-100 flex items-center justify-center">19.50</div>
              <div className="text-[#055bc7]">₹ 10,647</div>
            </div>
          </div>
        </div>

        {/* DOUBLE */}
        <div className="flex flex-col rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
          <div className="bg-[#599c15] text-white py-4 px-2 flex items-center justify-center gap-3 font-heading text-xl font-bold tracking-widest">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/></svg>
            DOUBLE
          </div>
          <div className="grid grid-cols-3 bg-gray-50 text-[10px] md:text-[11px] font-bold text-gray-700 uppercase text-center border-b border-gray-200 py-3">
            <div>SIZE<br/>(INCHES)</div>
            <div className="flex items-center justify-center border-l border-r border-gray-200">SQ.FT.</div>
            <div className="flex items-center justify-center">PRICE (₹)</div>
          </div>
          <div className="flex flex-col text-sm font-semibold text-center divide-y divide-gray-100 h-full">
            <div className="grid grid-cols-3 py-3 hover:bg-green-50/50 transition-colors flex-1">
              <div className="text-gray-800 flex items-center justify-center">72&quot; × 48&quot;</div>
              <div className="text-gray-600 border-l border-r border-gray-100 flex items-center justify-center">24.00</div>
              <div className="text-[#599c15] flex items-center justify-center">₹ 13,104</div>
            </div>
            <div className="grid grid-cols-3 py-3 hover:bg-green-50/50 transition-colors flex-1">
              <div className="text-gray-800 flex items-center justify-center">75&quot; × 48&quot;</div>
              <div className="text-gray-600 border-l border-r border-gray-100 flex items-center justify-center">25.00</div>
              <div className="text-[#599c15] flex items-center justify-center">₹ 13,650</div>
            </div>
            <div className="grid grid-cols-3 py-3 hover:bg-green-50/50 transition-colors flex-1">
              <div className="text-gray-800 flex items-center justify-center">78&quot; × 48&quot;</div>
              <div className="text-gray-600 border-l border-r border-gray-100 flex items-center justify-center">26.00</div>
              <div className="text-[#599c15] flex items-center justify-center">₹ 14,196</div>
            </div>
            <div className="grid grid-cols-3 py-3 hover:bg-green-50/50 transition-colors flex-1">
              <div className="text-gray-800 flex items-center justify-center">84&quot; × 48&quot;</div>
              <div className="text-gray-600 border-l border-r border-gray-100 flex items-center justify-center">28.00</div>
              <div className="text-[#599c15] flex items-center justify-center">₹ 15,288</div>
            </div>
          </div>
        </div>

        {/* QUEEN */}
        <div className="flex flex-col rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
          <div className="bg-[#782c7a] text-white py-4 px-2 flex items-center justify-center gap-3 font-heading text-xl font-bold tracking-widest">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/></svg>
            QUEEN
          </div>
          <div className="grid grid-cols-3 bg-gray-50 text-[10px] md:text-[11px] font-bold text-gray-700 uppercase text-center border-b border-gray-200 py-3">
            <div>SIZE<br/>(INCHES)</div>
            <div className="flex items-center justify-center border-l border-r border-gray-200">SQ.FT.</div>
            <div className="flex items-center justify-center">PRICE (₹)</div>
          </div>
          <div className="flex flex-col text-sm font-semibold text-center divide-y divide-gray-100 h-full">
            <div className="grid grid-cols-3 py-3 hover:bg-purple-50/50 transition-colors flex-1">
              <div className="text-gray-800 flex items-center justify-center">72&quot; × 60&quot;</div>
              <div className="text-gray-600 border-l border-r border-gray-100 flex items-center justify-center">30.00</div>
              <div className="text-[#782c7a] flex items-center justify-center">₹ 16,380</div>
            </div>
            <div className="grid grid-cols-3 py-3 hover:bg-purple-50/50 transition-colors flex-1">
              <div className="text-gray-800 flex items-center justify-center">75&quot; × 60&quot;</div>
              <div className="text-gray-600 border-l border-r border-gray-100 flex items-center justify-center">31.25</div>
              <div className="text-[#782c7a] flex items-center justify-center">₹ 17,053</div>
            </div>
            <div className="grid grid-cols-3 py-3 hover:bg-purple-50/50 transition-colors flex-1">
              <div className="text-gray-800 flex items-center justify-center">78&quot; × 60&quot;</div>
              <div className="text-gray-600 border-l border-r border-gray-100 flex items-center justify-center">32.50</div>
              <div className="text-[#782c7a] flex items-center justify-center">₹ 17,725</div>
            </div>
            <div className="grid grid-cols-3 py-3 hover:bg-purple-50/50 transition-colors flex-1">
              <div className="text-gray-800 flex items-center justify-center">84&quot; × 60&quot;</div>
              <div className="text-gray-600 border-l border-r border-gray-100 flex items-center justify-center">35.00</div>
              <div className="text-[#782c7a] flex items-center justify-center">₹ 19,110</div>
            </div>
          </div>
        </div>

        {/* KING */}
        <div className="flex flex-col rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
          <div className="bg-[#eb7407] text-white py-4 px-2 flex items-center justify-center gap-3 font-heading text-xl font-bold tracking-widest">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/></svg>
            KING
          </div>
          <div className="grid grid-cols-3 bg-gray-50 text-[10px] md:text-[11px] font-bold text-gray-700 uppercase text-center border-b border-gray-200 py-3">
            <div>SIZE<br/>(INCHES)</div>
            <div className="flex items-center justify-center border-l border-r border-gray-200">SQ.FT.</div>
            <div className="flex items-center justify-center">PRICE (₹)</div>
          </div>
          <div className="flex flex-col text-sm font-semibold text-center divide-y divide-gray-100 h-full">
            <div className="grid grid-cols-3 py-3 hover:bg-orange-50/50 transition-colors flex-1">
              <div className="text-gray-800 flex items-center justify-center">72&quot; × 72&quot;</div>
              <div className="text-gray-600 border-l border-r border-gray-100 flex items-center justify-center">36.00</div>
              <div className="text-[#eb7407] flex items-center justify-center">₹ 19,656</div>
            </div>
            <div className="grid grid-cols-3 py-3 hover:bg-orange-50/50 transition-colors flex-1">
              <div className="text-gray-800 flex items-center justify-center">75&quot; × 72&quot;</div>
              <div className="text-gray-600 border-l border-r border-gray-100 flex items-center justify-center">37.50</div>
              <div className="text-[#eb7407] flex items-center justify-center">₹ 20,475</div>
            </div>
            <div className="grid grid-cols-3 py-3 hover:bg-orange-50/50 transition-colors flex-1">
              <div className="text-gray-800 flex items-center justify-center">78&quot; × 72&quot;</div>
              <div className="text-gray-600 border-l border-r border-gray-100 flex items-center justify-center">39.00</div>
              <div className="text-[#eb7407] flex items-center justify-center">₹ 21,294</div>
            </div>
            <div className="grid grid-cols-3 py-3 hover:bg-orange-50/50 transition-colors flex-1">
              <div className="text-gray-800 flex items-center justify-center">84&quot; × 72&quot;</div>
              <div className="text-gray-600 border-l border-r border-gray-100 flex items-center justify-center">42.00</div>
              <div className="text-[#eb7407] flex items-center justify-center">₹ 22,932</div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
