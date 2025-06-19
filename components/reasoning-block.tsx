import { memo, useState } from "react";
import { ChevronDown } from "lucide-react";

function NonMemoizedReasoningBlock({ reasoning }: { reasoning: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
      >
        <span
          className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
        >
          <ChevronDown size={16} />
        </span>
        <span>Reasoning</span>
      </button>
      {isExpanded && (
        <div className="mt-3 p-4 border-l-2 border-white/20 bg-white/5 text-white/90 text-sm rounded-r-lg">
          <div className="whitespace-pre-wrap">{reasoning}</div>
        </div>
      )}
    </div>
  );
}

const ReasoningBlock = memo(NonMemoizedReasoningBlock);

export default ReasoningBlock;
