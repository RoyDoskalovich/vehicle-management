// import React from "react";
// import ReactDOM from "react-dom/client";
// import {RouterProvider} from "react-router-dom";
// import {router} from "./router";
//
// ReactDOM.createRoot(document.getElementById("root")!).render(
//     <React.StrictMode>
//         <RouterProvider router={router}/>
//     </React.StrictMode>
// );

// import React from "react";
// import ReactDOM from "react-dom/client";
//
// function Smoke() {
//     return <div style={{padding: 24, fontFamily: "system-ui"}}>Frontend boots</div>;
// }
//
// ReactDOM.createRoot(document.getElementById("root")!).render(
//     <React.StrictMode>
//         <Smoke/>
//     </React.StrictMode>
// );


import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import App from "./App";
import VehiclesListPage from "./pages/VehiclesListPage";
import VehicleFormPage from "./pages/VehicleFormPage";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route index element={<VehiclesListPage />} />
            <Route path="vehicle/new" element={<VehicleFormPage />} />
            <Route path="vehicle/:id" element={<VehicleFormPage />} />
        </Route>
    )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

