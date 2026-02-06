"use client";

interface SizeSelectorProps {
  sizes: string[];
  selected: string | null;
  onSelect: (size: string) => void;
}

export default function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div>
      <p className="text-sm font-medium mb-2">Размер</p>
      <div className="flex gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={`w-12 h-12 border text-sm font-medium transition-colors ${
              selected === size
                ? "border-primary bg-primary text-white"
                : "border-border hover:border-primary"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
