import { createBrowserRouter, RouterProvider } from "react-router-dom";
import VulcanHome from "../pages/VulcanHome";
import VulcanoLogin from "../components/VulcanoLogin";
import VulcanoRegister from "../components/VulcanoRegister";
import Review from "../pages/Review";
import { Page404 } from "../pages/Page404";
import ModuleView from "../pages/ModuleView";
import CoursePage from "../pages/CoursePage";
import UserManagement from "../pages/UserManagement";
import Layout from "../pages/layout/Layout";
import DashboardHome from "../pages/layout/DashboardHome";
import ClassScheduling from "../components/ClassScheduling";
import ClassManagement from "../components/ClassManagement";
import TeacherForm from "../components/TeacherForm";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <VulcanHome />,
    },
    {
        // Ruta pública: cualquiera puede acceder
        path: "/login",
        element: <VulcanoLogin />,
    },
    {
        // Ruta pública: cualquiera puede acceder
        path: "/register",
        element: <VulcanoRegister />,
    },
    {
        // Ruta PROTEGIDA: solo usuarios con sesión activa
        // PrivateRoute verifica el localStorage antes de mostrar Layout
        path: "/layout",
        element: <PrivateRoute><Layout /></PrivateRoute>,
        children: [
            {
                index: true,
                element: <DashboardHome />,
            },
            {
                path: "course",
                element: <CoursePage />,
            },
            {
                path: "module-view",
                element: <ModuleView />,
            },
            {
                path: "agendar",
                element: <ClassScheduling />,
            },
            {
                path: "clases",
                element: <ClassManagement />,
            },
            {
                path: "docentes",
                element: <TeacherForm />,
            },
            {
                path: "review",
                element: <Review />,
            },
            {
                path: "users",
                element: <UserManagement />,
            }
        ],
    },
    {
        path: "*",
        element: <Page404 />,
    },
]);

export const MyRoutes = () => <RouterProvider router={router} />;
