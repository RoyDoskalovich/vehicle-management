import type {Vehicle} from "@vm/shared";
import StatusSelect from "./StatusSelect";
import * as React from "react";

type SortKey = "createdAt" | "licensePlate";

type Props = {
    rows: Vehicle[];
    sort: SortKey;
    order: "asc" | "desc";
    onSortChange: (sort: SortKey) => void;
    onToggleOrder: () => void;
    onChangeStatus: (id: string, next: Vehicle["status"]) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    loading?: boolean;
};

export default function VehicleTable({
                                         rows,
                                         sort,
                                         order,
                                         onSortChange,
                                         onToggleOrder,
                                         onChangeStatus,
                                         onEdit,
                                         onDelete,
                                         loading
                                     }: Props) {
    return (
        <div style={{overflowX: "auto"}}>
            <table style={{width: "100%", borderCollapse: "collapse"}}>
                <thead>
                <tr>
                    <Th>ID</Th>
                    <Th
                        onClick={() => onSortChange("licensePlate")}
                        clickable
                        active={sort === "licensePlate"}
                        order={order}
                        onToggleOrder={onToggleOrder}
                    >
                        License Plate
                    </Th>
                    <Th>Status</Th>
                    <Th
                        onClick={() => onSortChange("createdAt")}
                        clickable
                        active={sort === "createdAt"}
                        order={order}
                        onToggleOrder={onToggleOrder}
                    >
                        Created AT
                    </Th>
                    <Th>Actions</Th>
                </tr>
                </thead>
                <tbody>
                {loading && (!rows || rows.length === 0) ? (
                    <tr>
                        <td colSpan={5} style={{padding: 12}}>Loading...</td>
                    </tr>
                ) : (!rows || rows.length === 0) ? (
                    <tr>
                        <td colSpan={5} style={{padding: 12}}>No vehicles</td>
                    </tr>
                ) : rows.map(vehicle => (
                    <tr key={vehicle.id} style={{borderTop: "1px solid #eee"}}>
                        <Td mono>{vehicle.id}</Td>
                        <Td>{vehicle.licensePlate}</Td>
                        <Td>
                            <StatusSelect
                                value={vehicle.status}
                                onChange={(next) => onChangeStatus(vehicle.id, next)}
                            />
                        </Td>
                        <Td>{new Date(vehicle.createdAt).toLocaleString()}</Td>
                        <Td>
                            <button onClick={() => onEdit(vehicle.id)}>Edit</button>
                            {" "}
                            <button onClick={() => onDelete(vehicle.id)}>Delete</button>
                        </Td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

function Th({children, clickable, active, order, onClick, onToggleOrder,}: {
    children: React.ReactNode;
    clickable?: boolean;
    active?: boolean;
    order?: "asc" | "desc";
    onClick?: () => void;
    onToggleOrder?: () => void;
}) {
    const thTitleProps: React.ThHTMLAttributes<HTMLTableCellElement> = clickable
        ? {title: "Click to sort / toggle order"}
        : {};

    return (
        <th
            {...thTitleProps}
            onClick={() => {
                if (!clickable) return;
                if (active && onToggleOrder) onToggleOrder();
                onClick?.();
            }}
            style={{
                textAlign: "left",
                padding: 8,
                cursor: clickable ? "pointer" : "default",
                userSelect: "none",
            }}
        >
            {children} {active ? (order === "asc" ? "▲" : "▼") : null}
        </th>
    );
}

function Td({children, mono}: { children: React.ReactNode; mono?: boolean }) {
    const style: React.CSSProperties = {
        padding: 8,
        ...(mono ? {fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"} : {}),
    };

    return <td style={style}>{children}</td>;
}