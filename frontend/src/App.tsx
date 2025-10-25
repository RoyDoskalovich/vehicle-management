import {Outlet, Link, useLocation} from "react-router-dom";

export default function App() {
    const {pathname} = useLocation();
    return (
        <div style={{maxWidth: 960, margin: "0 auto", padding: 16}}>
            <header style={{display: "flex", gap: 16, alignItems: "center", marginBottom: 24}}>
                <h1 style={{margin: 0}}>Vehicle Management</h1>
                <nav style={{marginLeft: "auto", display: "flex", gap: 12}}>
                    <Link to="/" style={{fontWeight: pathname === "/" ? 700 : 400}}>List</Link>
                    <Link to="/vehicle/new">Create</Link>
                </nav>
            </header>
            <Outlet/>
        </div>
    );
}
