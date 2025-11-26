export default function Sidebar({
  items = [],
  onSelect,
  selectedIds = [],
  onHoverQuestion
}) {
  const selectedSet = new Set(selectedIds);

  function toggleSelection(id) {
    const next = new Set(selectedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);

    onSelect(Array.from(next));   // send array to parent
  }

  return (
    <aside className="w-64 bg-gray-50 border-r overflow-auto p-3">
      <ul className="space-y-1">
        {items.map((q, idx) => {
          const id = q.id ?? idx;
          const isSelected = selectedSet.has(id);

          return (
            <li
              key={id}
              className={`
    group relative flex items-center justify-between 
    px-3 py-2 rounded-md border
    transition-all duration-75      /* faster transitions */
    cursor-pointer select-none
    overflow-hidden
    w-full

    ${isSelected
                  ? "bg-gray-400 border-gray-400 text-white"
                  : "bg-white border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                }
  `}
              onClick={() => toggleSelection(id)}
            >
              {/* Hover-only zone (NO impact on clicking) */}
              <div
                className="absolute inset-0"
                onMouseEnter={() => onHoverQuestion?.(q)}
                onMouseLeave={() => onHoverQuestion?.(null)}
              />

              {/* Left accent */}
              <div
                className={`
    absolute left-0 top-0 w-1 h-full transition-all
    ${isSelected ? "bg-gray-400" : "group-hover:bg-gray-400/40"}
    `}
              />

              <div className="relative text-sm truncate max-w-[10rem] z-10">
                {q.preview || q.title || `Q ${id}`}
              </div>

              <span className="relative text-xs opacity-70 z-10">#{idx + 1}</span>
            </li>

          );
        })}
      </ul>
    </aside>
  );
}
