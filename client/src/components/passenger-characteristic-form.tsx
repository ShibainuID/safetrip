import { type Dispatch, type SetStateAction } from "react";
import { User, Activity, Shirt, Scissors } from "lucide-react";

export interface PassengerAttributes {
  gender: string;
  age_group: string;
  upper_clothing: string;
  lower_clothing: string;
  accessories: string;
}

interface PassengerCharacteristicFormProps {
  attributes: PassengerAttributes;
  onChange: Dispatch<SetStateAction<PassengerAttributes>>;
}

export function PassengerCharacteristicForm({
  attributes,
  onChange,
}: PassengerCharacteristicFormProps) {
  const update = (key: keyof PassengerAttributes, value: string) => {
    onChange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          <User className="h-4 w-4 text-muted" /> Gender
        </label>
        <div className="flex gap-2">
          {["Male", "Female", "Unknown"].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => update("gender", opt)}
              className={`flex-1 rounded-full border py-2 text-sm font-bold transition-colors ${
                attributes.gender === opt
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-hairline bg-surface-strong text-muted hover:bg-slate-200 hover:text-ink"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Activity className="h-4 w-4 text-muted" /> Approximate Age
        </label>
        <select
          value={attributes.age_group}
          onChange={(e) => update("age_group", e.target.value)}
          className="w-full appearance-none rounded-full border border-hairline bg-surface-strong px-4 py-2.5 text-sm font-medium text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Select age group...</option>
          <option value="Child">Child</option>
          <option value="Teen">Teen</option>
          <option value="Adult">Adult</option>
          <option value="Elderly">Elderly</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Shirt className="h-4 w-4 text-muted" /> Clothing
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={attributes.upper_clothing}
            onChange={(e) => update("upper_clothing", e.target.value)}
            placeholder="Upper (e.g. red jacket)"
            className="w-full rounded-full border border-hairline bg-surface-strong px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            type="text"
            value={attributes.lower_clothing}
            onChange={(e) => update("lower_clothing", e.target.value)}
            placeholder="Lower (e.g. blue jeans)"
            className="w-full rounded-full border border-hairline bg-surface-strong px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Scissors className="h-4 w-4 text-muted" /> Distinctive Accessories
        </label>
        <input
          type="text"
          value={attributes.accessories}
          onChange={(e) => update("accessories", e.target.value)}
          placeholder="e.g. black backpack, cap, glasses..."
          className="w-full rounded-full border border-hairline bg-surface-strong px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}
