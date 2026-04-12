import { BrowserRouter, Route, Routes } from "react-router-dom";
import VulcanHome from "../pages/VulcanHome"
import VulcanoLogin from "../components/VulcanoLogin";
import VulcanoRegister from "../components/VulcanoRegister";
import Review from "../pages/Review";
import { Page404 } from "../pages/Page404"
import ModuleView from "../pages/ModuleView"
import CoursePage from "../pages/CoursePage"
// Importamos el Layout al que redirigimos después del login exitoso
import Layout from "../pages/layout/Layout";

export const MyRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<VulcanHome />} />
            <Route path="/Login" element={<VulcanoLogin />} />
            <Route path="/Register" element={<VulcanoRegister />} />
            <Route path="/Course" element={<CoursePage />} />
            <Route path="/ModuleView" element={<ModuleView />} />
            <Route path="/Review" element={<Review />} />
            {/* Ruta de destino después del login */}
            <Route path="/layout" element={<Layout />} />
            <Route path="*" element={<Page404 />} />
        </Routes>
    </BrowserRouter>
)
