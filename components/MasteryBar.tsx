type MasteryBarProps = {
  mastery: number; // Between 0 and 1
};

export function MasteryBar({ mastery }: MasteryBarProps) {
  const clamped = Math.max(0, Math.min(1, mastery));
  const hue = clamped * 120; // 0 = red, 120 = green
  const barColor = `hsl(${hue}, 100%, 50%)`;

  return (
    <div className="w-full h-3 bg-muted rounded overflow-hidden">
      <div
        className="h-full transition-all duration-300"
        style={{
          width: `${clamped * 100}%`,
          backgroundColor: barColor,
        }}
      />
    </div>
  );
}
