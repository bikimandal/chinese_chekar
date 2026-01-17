"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Users, Plus, Edit2, Trash2, Loader2, Check, X, Shield, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import Loader from "@/components/Loader";
import BackButton from "../../../components/BackButton";

interface User {
  id: string;
  email: string;
  name?: string | null;
  role: "ADMIN" | "USER";
  storeAccess: Array<{
    store: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

interface Store {
  id: string;
  name: string;
  slug: string;
  isDefault?: boolean;
}

export default function UsersPage() {
  const { currentStore, loading: storeLoading } = useStore();
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "USER" as "ADMIN" | "USER",
    storeIds: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchStores();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users", {
        credentials: "include",
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await fetch("/api/stores", {
        credentials: "include",
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        setStores(data);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";
      const method = editingUser ? "PUT" : "POST";

      const payload: any = {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        storeIds: formData.storeIds,
      };

      if (!editingUser || formData.password) {
        payload.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingUser(null);
        setFormData({
          email: "",
          password: "",
          name: "",
          role: "USER" as "ADMIN" | "USER",
          storeIds: [],
        });
        fetchUsers();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save user");
      }
    } catch (error) {
      console.error("Error saving user:", error);
      setError("An error occurred while saving user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: "",
      name: user.name || "",
      role: user.role,
      storeIds: user.storeAccess.map((sa) => sa.store.id),
    });
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    setDeletingUserId(userId);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting user");
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({
      email: "",
      password: "",
      name: "",
      role: "USER" as "ADMIN" | "USER",
      storeIds: [],
    });
    setError("");
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="w-4 h-4" />;
      default:
        return <UserIcon className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/30";
    }
  };

  if (storeLoading || loading) {
    return <Loader message="Loading users..." />;
  }

  if (!currentStore) {
    return null;
  }

  const settingsPath = `/admin/${currentStore.slug}/settings`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-6">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between gap-2 sm:gap-4 mb-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h1
                  className="text-lg sm:text-2xl font-bold text-white truncate"
                  style={{ fontFamily: "var(--font-body), sans-serif" }}
                >
                  User Management
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-400 truncate">{currentStore.name}</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <BackButton href={settingsPath} label="Back to Settings" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-600/10 backdrop-blur-sm rounded-lg sm:rounded-xl border border-emerald-500/30 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="text-xl font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-body), sans-serif" }}
              >
                User Management
              </h2>
              <p className="text-sm text-slate-400">
                Create and manage user accounts and store access
              </p>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/20"
              >
                <Plus className="w-5 h-5" />
                <span>Create User</span>
              </button>
            )}
          </div>

          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl border border-slate-700/50 mb-6"
            >
              <div className="flex items-center justify-between mb-4 gap-2">
                <h3
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "var(--font-body), sans-serif" }}
                >
                  {editingUser ? "Edit User" : "Create New User"}
                </h3>
                <button
                  onClick={handleCancel}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {editingUser ? "New Password (leave empty to keep current)" : "Password *"}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required={!editingUser}
                    minLength={6}
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as "ADMIN" | "USER",
                      })
                    }
                    required
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  >
                    <option value="USER">User - Access to assigned stores</option>
                    <option value="ADMIN">Admin - Full access to all stores</option>
                  </select>
                </div>

                {formData.role !== "ADMIN" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Store Access *
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-slate-900/30 rounded-lg border border-slate-700">
                      {stores.map((store) => (
                        <label
                          key={store.id}
                          className="flex items-center gap-3 p-2 hover:bg-slate-800/50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.storeIds.includes(store.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  storeIds: [...formData.storeIds, store.id],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  storeIds: formData.storeIds.filter(
                                    (id) => id !== store.id
                                  ),
                                });
                              }
                            }}
                            className="w-4 h-4 text-emerald-600 bg-slate-900 border-slate-700 rounded focus:ring-emerald-500"
                          />
                          <span className="text-sm text-slate-300">{store.name}</span>
                          {store.isDefault && (
                            <span className="text-xs text-emerald-400">(Default)</span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting || (formData.role !== "ADMIN" && formData.storeIds.length === 0)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{editingUser ? "Save Changes" : "Create User"}</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2.5 bg-slate-700/50 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl border border-slate-700/50 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4 gap-2">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-lg flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3
                        className="font-semibold text-white text-sm sm:text-base truncate"
                        style={{ fontFamily: "var(--font-body), sans-serif" }}
                        title={user.name || user.email}
                      >
                        {user.name || user.email}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 truncate" title={user.email}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(user)}
                      disabled={deletingUserId === user.id}
                      className="p-2 text-slate-400 hover:text-emerald-400 transition-colors disabled:opacity-50"
                      title="Edit user"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingUserId === user.id}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Delete user"
                    >
                      {deletingUserId === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-full ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {getRoleIcon(user.role)}
                    <span className="text-xs font-medium">{user.role}</span>
                  </div>
                  {user.role !== "ADMIN" && (
                    <div className="mt-2">
                      <p className="text-xs text-slate-500 mb-1">Store Access:</p>
                      <div className="flex flex-wrap gap-1">
                        {user.storeAccess.length > 0 ? (
                          user.storeAccess.map((sa) => (
                            <span
                              key={sa.store.id}
                              className="text-xs px-2 py-0.5 bg-slate-700/50 text-slate-300 rounded"
                            >
                              {sa.store.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-red-400">No stores assigned</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {users.length === 0 && !showForm && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No users found</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-500 hover:to-teal-500 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First User</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
