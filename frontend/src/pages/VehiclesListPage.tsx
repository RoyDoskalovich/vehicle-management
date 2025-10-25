import {useNavigate} from "react-router-dom";
import {useVehiclesList} from "../hooks/useVehicles";
import VehicleTable from "../components/VehicleTable";
import StatusSelect from "../components/StatusSelect";
import {VehicleStatus as VS} from "@vm/shared";
import React, {useState} from "react";

export default function VehiclesListPage() {
    const nav = useNavigate();

    const {params, setParams, data, total, loading, error, changeStatus, remove} = useVehiclesList({
        sort: "createdAt",
        order: "desc",
        page: 1,
        pageSize: 10,
    });

    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const vehicle = e.target.value;
        setParams(p => ({...p, search: vehicle, page: 1}));
    }

    function onStatusFilterChange(next?: string) {
        setParams(p => ({
            ...p,
            status: next && (next === "All" ? undefined : (next as any)),
            page: 1,
        }));
    }

    function onSortChange(sort: "createdAt" | "licensePlate") {
        setParams(p => ({...p, sort, page: 1}));
    }

    function onToggleOrder() {
        setParams(p => ({...p, order: p.order === "asc" ? "desc" : "asc"}));
    }

    function onPageChange(next: number) {
        setParams(p => ({...p, page: next}));
    }

    async function handleDelete(id: string) {
        const ok = window.confirm("Are you sure you want to delete this vehicle?");
        if (!ok) return;
        try {
            await remove(id);
        } catch (e: any) {
            alert(e?.response?.data?.message ?? "Delete Failed.");
        } finally {
            setPendingDeleteId(null);
        }
    }

    return (
        <div>
            <Toolbar>
                <div style={{display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap"}}>
                    <label>
                        Status:&nbsp;
                        <select
                            value={params.status ?? "All"}
                            onChange={(e) => onStatusFilterChange(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value={VS.Available}>Available</option>
                            <option value={VS.InUse}>InUse</option>
                            <option value={VS.Maintenance}>Maintenance</option>
                        </select>
                    </label>

                    <input
                        placeholder="Search by license plate..."
                        defaultValue={params.search ?? ""}
                        onChange={onSearchChange}
                    />
                </div>

                <button onClick={() => nav("/vehicle/new")}>+ New Vehicle</button>
            </Toolbar>

            {error ? <div style={{color: "crimson", marginBottom: 12}}>{error}</div> : null}

            <VehicleTable
                rows={data}
                sort={params.sort ?? "createdAt"}
                order={params.order ?? "desc"}
                onSortChange={onSortChange}
                onToggleOrder={onToggleOrder}
                onChangeStatus={async (id, next) => {
                    try {
                        await changeStatus(id, next);
                    } catch (e: any) {
                        alert(e?.response?.data?.message ?? "Status change failed");
                    }
                }}
                onEdit={(id) => nav(`/vehicle/${id}`)}
                onDelete={(id) => {
                    setPendingDeleteId(id);
                    handleDelete(id);
                }}
                loading={loading}
            />

            <Pagination
                page={params.page ?? 1}
                pageSize={params.pageSize ?? 10}
                total={total}
                onPageChange={onPageChange}
            />
        </div>
    );
}

function Toolbar({children}: { children: React.ReactNode }) {
    return (
        <div style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
            flexWrap: "wrap",
        }}>
            {children}
        </div>
    );
}

function Pagination({page, pageSize, total, onPageChange}: {
    page: number; pageSize: number; total: number;
    onPageChange: (page: number) => void;
}) {
    const pages = Math.max(1, Math.ceil(total / pageSize));
    return (
        <div style={{marginTop: 12, display: "flex", gap: 8, alignItems: "center"}}>
            <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Prev</button>
            <span>Page {page} / {pages}</span>
            <button disabled={page >= pages} onClick={() => onPageChange(page + 1)}>Next</button>
        </div>
    );
}