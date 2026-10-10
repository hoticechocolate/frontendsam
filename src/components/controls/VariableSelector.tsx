import Icon, { type IconName } from "@/components/common/Icon"
import ToggleButton from "@/components/common/ToggleButton"
import { useDashboardStore } from "@/hooks/useDashboardStore"
import type { Variable } from "@/utils/types"
import { VARIABLES, VARIABLE_KEYS } from "@/utils/colorScales"

const VARIABLE_ICONS: Record<Variable, IconName> = {
  sic: "snow",
  tos: "thermo",
  tas: "sun",
}

export default function VariableSelector() {
  const variable = useDashboardStore((s) => s.variable)
  const setVariable = useDashboardStore((s) => s.setVariable)

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-bold text-navy-900">변수 선택</p>
      
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {VARIABLE_KEYS.map((key) => (
          <ToggleButton
            key={key}
            active={variable === key}
            onClick={() => setVariable(key)}
            className="px-3 py-3"
          >
            <Icon name={VARIABLE_ICONS[key]} className="size-4" />
            {VARIABLES[key].label}
          </ToggleButton>
        ))}
      </div>
    </div>
  )
}