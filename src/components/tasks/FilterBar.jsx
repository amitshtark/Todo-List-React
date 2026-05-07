import { Search, X, ChevronDown } from 'lucide-react';
import useTaskStore from '../../store/taskStore.js';
import useUIStore from '../../store/uiStore.js';
import { STATUS, STATUS_LABELS, PRIORITY, PRIORITY_LABELS, SORT_OPTIONS } from '../../utils/constants.js';
import { useState, useRef } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside.js';

function FilterBar() {
  const { filters, sortBy, setFilter, clearFilters, setSortBy } = useTaskStore();
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);
  useClickOutside(sortRef, () => setSortOpen(false));

  function toggleStatus(val) {
    const arr = filters.status;
    setFilter('status', arr.includes(val) ? arr.filter(s => s !== val) : [...arr, val]);
  }
  function togglePriority(val) {
    const arr = filters.priority;
    setFilter('priority', arr.includes(val) ? arr.filter(p => p !== val) : [...arr, val]);
  }

  const hasActive = filters.status.length > 0 || filters.priority.length > 0 || filters.search;

  return (
    <div className="filter-bar">
      {/* Search */}
      <div className="filter-search">
        <Search size={14} className="filter-search-icon" />
        <input
          id="task-search-input"
          className="filter-search-input"
          placeholder="Search tasks…"
          value={filters.search}
          onChange={e => setFilter('search', e.target.value)}
          aria-label="Filter tasks by search"
        />
        {filters.search && (
          <button onClick={() => setFilter('search', '')} className="filter-clear-icon" aria-label="Clear search">
            <X size={12} />
          </button>
        )}
      </div>

      {/* Status pills */}
      <div className="filter-group">
        {Object.entries(STATUS_LABELS).map(([val, label]) => (
          <button
            key={val}
            className={`filter-pill ${filters.status.includes(val) ? 'filter-pill-active' : ''}`}
            onClick={() => toggleStatus(val)}
            aria-pressed={filters.status.includes(val)}
            id={`filter-status-${val}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Priority pills */}
      <div className="filter-group">
        {Object.entries(PRIORITY_LABELS).map(([val, label]) => (
          <button
            key={val}
            className={`filter-pill filter-pill-priority ${filters.priority.includes(val) ? 'filter-pill-active' : ''}`}
            onClick={() => togglePriority(val)}
            aria-pressed={filters.priority.includes(val)}
            id={`filter-priority-${val}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="filter-sort" ref={sortRef}>
        <button
          className="btn btn-ghost btn-sm filter-sort-btn"
          onClick={() => setSortOpen(v => !v)}
          id="sort-dropdown-btn"
        >
          {SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Sort'}
          <ChevronDown size={13} />
        </button>
        {sortOpen && (
          <div className="dropdown-menu filter-sort-menu">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`dropdown-item ${sortBy === opt.value ? 'dropdown-item-active' : ''}`}
                onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                id={`sort-option-${opt.value}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clear all */}
      {hasActive && (
        <button
          className="btn btn-ghost btn-sm"
          onClick={clearFilters}
          id="clear-filters-btn"
        >
          <X size={13} /> Clear
        </button>
      )}
    </div>
  );
}

export default FilterBar;
