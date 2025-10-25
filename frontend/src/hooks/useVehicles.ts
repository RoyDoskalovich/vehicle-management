import {useEffect, useMemo, useState} from "react";
import {VehiclesAPI} from "../api/vehicles.ts";
import type {Vehicle, VehicleStatus} from "@vm/shared";

export interface ListParams {
    status?: VehicleStatus;
    search?: string;
    sort?: "createdAt" | "licensePlate";
    order?: "asc" | "desc";
    page?: number;
    pageSize?: number;
}

export function useVehiclesList(initial: ListParams = {}) {
    const [params, setParams] = useState<ListParams>({
        sort: "createdAt",
        order: "desc",
        page: 1,
        pageSize: 10,
        ...initial,
    });

    const [data, setData] = useState<Vehicle[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        VehiclesAPI.list(params)
            .then((res) => {
                if (cancelled) return;
                setData(res.data);
                setTotal(res.total);
            })
            .catch((err) => {
                if (cancelled) return;
                const msg = err?.response?.data?.message || err.message || "Failed to load vehicles.";
                setError(msg);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true
        };
    }, [params.status, params.search, params.sort, params.order, params.page, params.pageSize]);

    const actions = useMemo(() => {
        return {
            refetch: () => setParams((p) => ({...p})),  // Trigger the useEffect.
            setParams,
            async changeStatus(id: string, status: VehicleStatus) {
                await VehiclesAPI.updateStatus(id, {status});
                setData((prev) => prev.map(vehicle => vehicle.id === id ? {...vehicle, status} : vehicle));
            },
            async remove(id: string) {
                await VehiclesAPI.remove(id);
                setData((prev) => prev.filter(v => v.id !== id));
                setTotal((prev) => prev - 1);
            },
        };
    }, []);

    return {params, setParams, data, total, loading, error, ...actions};
}