'use client';

export default function ClinicalTabs({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
    const tabs = ['Resumen', 'Consulta', 'Procedimientos quirúrgicos', 'Próximas Consultas'];
    return (
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-end gap-8">
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 pt-4 px-2 text-sm font-bold uppercase tracking-wide border-b-4 transition-all ${activeTab === tab ? 'border-teal-600 text-teal-700 dark:text-teal-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}
