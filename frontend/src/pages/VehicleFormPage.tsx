import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {VehiclesAPI} from "../api/vehicles";
import {VehicleStatus as VS, type Vehicle} from "@vm/shared";

export default function VehicleFormPage() {
    const nav = useNavigate();
    const {id} = useParams<{ id: string }>();

    const isEdit = !!id;
    const [loading, setLoading] = useState(false);
    const [licensePlate, setLicensePlate] = useState("");
    const [status, setStatus] = useState<typeof VS[keyof typeof VS]>(VS.Available);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isEdit) return;
        setLoading(true);
        VehiclesAPI.get(id)
            .then((vehicle) => {
                setLicensePlate(vehicle.licensePlate);
                setStatus(vehicle.status);
            })
            .catch((e) => setError(e?.response?.data?.message ?? "Failed to load vehicle."))
            .finally(() => setLoading(false));
    }, [id, isEdit]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (isEdit) {
                await VehiclesAPI.update(id!, {licensePlate, status});
            } else {
                await VehiclesAPI.create({licensePlate});
            }
            nav("/");
        } catch (e: any) {
            setError(e?.response?.data?.message ?? "Save failed.");
        }
    }

    return (
        <form onSubmit={onSubmit} style={{display: "grid", gap: 12, maxWidth: 480}}>
            <h2 style={{margin: 0}}>{isEdit ? "Edit Vehicle" : "Create Vehicle"}</h2>

            {error ? <div style={{color: "crimson"}}>{error}</div> : null}
            {loading ? <div>Loading...</div> : null}

            <label>
                License plate
                <input
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    placeholder="12-345-67"
                    required
                />
            </label>

            {isEdit ? (
                <label>
                    Status
                    <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                        <option value={VS.Available}>Available</option>
                        <option value={VS.InUse}>InUse</option>
                        <option value={VS.Maintenance}>Maintenance</option>
                    </select>
                </label>
            ) : null}

            <div style={{display: "flex", gap: 8}}>
                <button type="submit">{isEdit ? "Save" : "Create"}</button>
                <button type="button" onClick={() => nav(-1)}>Cancel</button>
            </div>
        </form>
    );
}