import { useState, useEffect } from "react";
import { getAllUsers, updateUserRole } from "../services/api";
import Swal from "sweetalert2";
import Layout from "./layout/Layout";
import ConfirmModal from "../components/ConfirmModal";
import "../styles/UserManagement.css";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setStatus] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    // Estado para el modal de confirmación
    const [confirmData, setConfirmData] = useState({
        isOpen: false,
        user: null,
        newRole: null
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setStatus(true);
            const data = await getAllUsers();
            setUsers(data.sort((a, b) => a.id - b.id));
        } catch (err) {
            setError(err.message || "Error al cargar la lista de usuarios.");
        } finally {
            setStatus(false);
        }
    };

    const handleOpenConfirm = (user) => {
        const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
        setConfirmData({
            isOpen: true,
            user,
            newRole
        });
    };

    const handleConfirmRoleChange = async () => {
        const { user, newRole } = confirmData;
        setConfirmData(prev => ({ ...prev, isOpen: false }));

        try {
            setActionLoading(user.id);
            await updateUserRole(user.id, newRole);
            setUsers(prev => prev.map(u => 
                u.id === user.id ? { ...u, role: newRole } : u
            ));
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: err.message || "No se pudo actualizar el rol.",
                icon: "error",
                confirmButtonColor: "#472825",
                background: "#fff4e2",
                color: "#472825"
            });
        } finally {
            setActionLoading(null);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="loading-state">
                    <span className="loading-spinner">🌋</span>
                    <p>Cargando usuarios...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="error-state text-center p-10">
                    <p className="text-red-600 font-bold mb-4">⚠️ {error}</p>
                    <button onClick={fetchUsers} className="btn-change-role mx-auto">Reintentar</button>
                </div>
            );
        }

        return (
            <div className="userman-table-wrapper">
                <table className="userman-table">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Estado</th>
                            <th>Rol Actual</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>
                                    <div className="user-info-cell">
                                        {u.profile?.profilePictureUrl ? (
                                            <img src={u.profile.profilePictureUrl} alt="Avatar" className="user-avatar-mini" />
                                        ) : (
                                            <div className="user-avatar-mini flex items-center justify-center bg-gray-100">👤</div>
                                        )}
                                        <div className="user-details">
                                            <span className="user-full-name">{u.profile?.firstName} {u.profile?.lastName}</span>
                                            <span className="user-username">@{u.username}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>{u.profile?.email}</td>
                                <td>
                                    <span className={`status-pill ${u.profile?.status?.toLowerCase()}`}>
                                        {u.profile?.status || "ACTIVE"}
                                    </span>
                                </td>
                                <td>
                                    <span className={`role-badge ${u.role?.toLowerCase()}`}>
                                        {u.role === "ADMIN" ? "ADMINISTRADOR" : "USUARIO"}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        onClick={() => handleOpenConfirm(u)}
                                        disabled={actionLoading === u.id}
                                        className={`btn-change-role ${u.role === "ADMIN" ? 'is-admin' : ''}`}
                                    >
                                        {actionLoading === u.id ? "⌛" : "🔄"}
                                        {u.role === "ADMIN" ? "Quitar Admin" : "Hacer Admin"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <Layout>
            <div className="userman-container">
                <div className="userman-header">
                    <h1 className="userman-title">Gestión de Usuarios</h1>
                    <p className="userman-subtitle">Panel exclusivo para administradores. Aquí puedes gestionar los accesos y roles del sistema.</p>
                </div>
                {renderContent()}
            </div>

            <ConfirmModal 
                isOpen={confirmData.isOpen}
                title="¿Cambiar rol?"
                message={`¿Estás seguro de que deseas cambiar el rol de ${confirmData.user?.profile?.firstName} a ${confirmData.newRole === "ADMIN" ? "ADMINISTRADOR" : "USUARIO"}?`}
                confirmText={confirmData.newRole === "ADMIN" ? "Ascender a Admin" : "Quitar Rol Admin"}
                type={confirmData.newRole === "ADMIN" ? "info" : "danger"}
                onConfirm={handleConfirmRoleChange}
                onCancel={() => setConfirmData(prev => ({ ...prev, isOpen: false }))}
            />
        </Layout>
    );
};

export default UserManagement;
