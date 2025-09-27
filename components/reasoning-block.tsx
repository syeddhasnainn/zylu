import { memo, useState } from "react";
import { ChevronDown } from "lucide-react";

function NonMemoizedReasoningBlock({ reasoning }: { reasoning: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-muted-foreground transition-colors text-sm font-medium"
      >
        <span
          className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
        >
          <ChevronDown size={16} />
        </span>
        <span>Reasoning</span>
      </button>
      {isExpanded && (
        <div className="mt-3 p-4 border-l bg-white/5 text-muted-foreground text-sm rounded-r-lg">
          <div className="whitespace-pre-wrap">{reasoning}</div>
        </div>
      )}
    </div>
  );
}

const ReasoningBlock = memo(NonMemoizedReasoningBlock);

export default ReasoningBlock;
