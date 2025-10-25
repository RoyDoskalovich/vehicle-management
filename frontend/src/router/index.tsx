import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import VehiclesListPage from "../pages/VehiclesListPage";
import VehicleFormPage from "../pages/VehicleFormPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {index: true, element: <VehiclesListPage/>},
            {path: "vehicle/new", element: <VehicleFormPage/>},
            {path: "vehicle/:id", element: <VehicleFormPage/>},
        ],
    },
] as any);