import {
  AMENITIES,
  BHK_OPTIONS,
  FURNISHING_OPTIONS,
  POSSESSION_OPTIONS,
  POSTED_BY_OPTIONS,
  PROPERTY_TYPES,
} from '../../utils/constants'
import { formatINR, cn } from '../../utils/format'
import { priceBoundsForType } from '../../utils/searchParams'
import RangeSlider from '../ui/RangeSlider'
import Button from '../ui/Button'

function ChipGroup({ options, value = [], onChange, capitalize }) {
  const toggle = (opt) => {
    onChange(value.includes(opt) ? value.filter((x) => x !== opt) : [...value, opt])
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition',
              active ? 'border-ink bg-ink text-white' : 'border-border bg-white text-ink hover:border-ink/40',
            )}
          >
            {capitalize ? opt : opt}
          </button>
        )
      })}
    </div>
  )
}

export default function SearchFilters({ filters, onChange, onClear, className, horizontal = false }) {
  const budget = priceBoundsForType(filters.type)
  const priceValue = [
    filters.minPrice ?? budget.min,
    filters.maxPrice ?? budget.max,
  ]
  const areaValue = [filters.minArea ?? 200, filters.maxArea ?? 6000]

  const patch = (partial) => onChange({ ...partial, page: 1 })

  return (
    <aside
      className={cn(
        horizontal
          ? 'flex flex-wrap items-start gap-6 [&>div]:min-w-[12rem] [&>div]:flex-1'
          : 'space-y-6',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Filters</h2>
        <button type="button" className="text-xs font-bold text-ink-muted hover:text-ink" onClick={onClear}>
          Clear all
        </button>
      </div>

      <RangeSlider
        label="Budget"
        min={budget.min}
        max={budget.max}
        step={budget.step}
        value={priceValue}
        formatValue={(v) => formatINR(v)}
        onChange={([minPrice, maxPrice]) =>
          patch({
            minPrice: minPrice <= budget.min ? null : minPrice,
            maxPrice: maxPrice >= budget.max ? null : maxPrice,
          })
        }
      />

      <div>
        <div className="mb-2 text-sm font-semibold">BHK</div>
        <ChipGroup options={BHK_OPTIONS} value={filters.bhk} onChange={(bhk) => patch({ bhk })} />
      </div>

      <div>
        <div className="mb-2 text-sm font-semibold">Property type</div>
        <ChipGroup
          options={PROPERTY_TYPES}
          value={filters.propertyType}
          onChange={(propertyType) => patch({ propertyType })}
        />
      </div>

      <div>
        <div className="mb-2 text-sm font-semibold">Furnishing</div>
        <ChipGroup
          options={FURNISHING_OPTIONS}
          value={filters.furnishing}
          onChange={(furnishing) => patch({ furnishing })}
        />
      </div>

      <div>
        <div className="mb-2 text-sm font-semibold">Possession</div>
        <ChipGroup
          options={POSSESSION_OPTIONS}
          value={filters.possession}
          onChange={(possession) => patch({ possession })}
        />
      </div>

      <div>
        <div className="mb-2 text-sm font-semibold">Posted by</div>
        <ChipGroup
          options={POSTED_BY_OPTIONS}
          value={filters.postedBy}
          onChange={(postedBy) => patch({ postedBy })}
          capitalize
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          checked={filters.verifiedOnly}
          onChange={(e) => patch({ verifiedOnly: e.target.checked })}
          className="h-4 w-4 rounded border-border"
        />
        Verified only
      </label>

      <RangeSlider
        label="Area (sq.ft)"
        min={200}
        max={6000}
        step={50}
        value={areaValue}
        formatValue={(v) => `${v} sq.ft`}
        onChange={([minArea, maxArea]) =>
          patch({
            minArea: minArea <= 200 ? null : minArea,
            maxArea: maxArea >= 6000 ? null : maxArea,
          })
        }
      />

      <div>
        <div className="mb-2 text-sm font-semibold">Amenities</div>
        <ChipGroup
          options={AMENITIES.slice(0, 12)}
          value={filters.amenities}
          onChange={(amenities) => patch({ amenities })}
        />
      </div>

      <Button className="w-full md:hidden" type="button">
        Apply filters
      </Button>
    </aside>
  )
}
