import {VehicleStatus} from "@vm/shared";

type Props = {
  value: typeof VehicleStatus[keyof typeof VehicleStatus];
  onChange: (next: typeof VehicleStatus[keyof typeof VehicleStatus]) => void;
  disabled?: boolean;
};

export default function StatusSelect({value, onChange, disabled}: Props) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as any)}
            disabled={!!disabled}
        >
            <option value={VehicleStatus.Available}>Available</option>
            <option value={VehicleStatus.InUse}>InUse</option>
            <option value={VehicleStatus.Maintenance}>Maintenance</option>
        </select>
    );
}