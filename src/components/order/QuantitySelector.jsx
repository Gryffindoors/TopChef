import { Plus, Minus } from "lucide-react";

export default function QuantitySelector({ unit, value, step, min, onChange }) {
  const isKilo = unit === "kg" || !unit;

  // Quick Pick Buttons
  const options = isKilo 
    ? [ { lab: "١/٤", val: 0.25 }, { lab: "١/٢", val: 0.5 }, { lab: "١", val: 1 } ]
    : [ { lab: "١", val: 1 }, { lab: "٢", val: 2 }, { lab: "٣", val: 3 } ];

  const increment = () => onChange(Number((value + step).toFixed(2)));
  const decrement = () => {
    if (value > min) onChange(Number((value - step).toFixed(2)));
  };

  return (
    <div className="space-y-4">
      {/* Quick Select Chips */}
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.val}
            onClick={() => onChange(opt.val)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer
              ${value === opt.val 
                ? "bg-red-600 border-red-600 text-white shadow-lg" 
                : "bg-neutral-900 border-white/5 text-gray-400"}`}
          >
            {opt.lab}
          </button>
        ))}
      </div>

      {/* Manual Counter */}
      <div className="flex items-center justify-between bg-black/40 p-2 rounded-2xl border border-white/5">
        <button 
          onClick={decrement}
          className="size-10 flex items-center justify-center bg-neutral-800 rounded-xl text-white hover:bg-neutral-700 cursor-pointer"
        >
          <Minus size={18} />
        </button>

        <div className="text-center">
          <span className="text-xl font-black text-white font-mono">
            {value}
          </span>
          <span className="text-[10px] text-gray-500 block font-bold">
            {isKilo ? "كيلو" : "وحدة"}
          </span>
        </div>

        <button 
          onClick={increment}
          className="size-10 flex items-center justify-center bg-red-600 rounded-xl text-white hover:bg-red-500 cursor-pointer"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}