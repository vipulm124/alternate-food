import { Info, Flame, Leaf, CheckCircle2 } from "lucide-react";

export interface ResultData {
    item: string;
    calories: string;
    notes: string;
    healthier_alternatives: string[];
}

interface ResultCardProps {
    data: ResultData | null;
}

function ResultCard({ data }: ResultCardProps) {
    if (!data) return null;

    return (
        <div className="w-full bg-white p-5 sm:p-8 rounded-3xl mt-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
                {/* Left Column: Original Item */}
                <div className="flex-1 bg-gray-50 p-5 sm:p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">You Searched For</h3>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize mb-6">{data.item}</h2>

                    <div className="flex items-center gap-4 bg-orange-50 text-orange-700 p-4 sm:p-5 rounded-xl mb-4">
                        <Flame className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
                        <div>
                            <p className="text-xs sm:text-sm font-medium opacity-80">Estimated Calories</p>
                            <p className="text-xl sm:text-2xl font-bold">{data.calories}</p>
                        </div>
                    </div>

                    <div className="flex gap-3 sm:gap-4 bg-blue-50 text-blue-800 p-4 sm:p-5 rounded-xl">
                        <Info className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 mt-0.5" />
                        <p className="text-sm sm:text-[15px] font-medium leading-relaxed">{data.notes}</p>
                    </div>
                </div>

                {/* Right Column: Alternatives */}
                <div className="flex-[1.2] bg-[#f0fdf4] p-5 sm:p-6 rounded-2xl border border-green-100">
                    <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
                        <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                        <h3 className="text-xl sm:text-2xl font-bold text-green-900">Healthier Alternatives</h3>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        {data.healthier_alternatives.map((alt, index) => (
                            <div key={index} className="flex gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-xl shadow-sm items-start border border-green-50 transition-transform hover:-translate-y-1 duration-300">
                                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 shrink-0 mt-0.5" />
                                <p className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed">{alt}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResultCard;
