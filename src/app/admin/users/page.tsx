"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Edit2, Trash2, Loader2, Check, X, Shield, User as UserIcon, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

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

      // Only include password if creating new user or if it's provided
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
          role: "USER",
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
      role: "USER",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2"
              style={{ fontFamily: "var(--font-body), sans-serif" }}
            >
              User Management
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
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

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl border border-slate-700/50 mb-4 sm:mb-6"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
              <h2
                className="text-lg sm:text-xl font-bold text-white truncate"
                style={{ fontFamily: "var(--font-body), sans-serif" }}
              >
                {editingUser ? "Edit User" : "Create New User"}
              </h2>
              <button
                onClick={handleCancel}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-white transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
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
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
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
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
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
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
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
                  <div className="space-y-2 max-h-40 sm:max-h-48 overflow-y-auto p-2 sm:p-3 bg-slate-900/30 rounded-lg border border-slate-700">
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
                          className="w-4 h-4 text-amber-600 bg-slate-900 border-slate-700 rounded focus:ring-amber-500"
                        />
                        <span className="text-sm text-slate-300">{store.name}</span>
                        {store.isDefault && (
                          <span className="text-xs text-amber-400">(Default)</span>
                        )}
                      </label>
                    ))}
                  </div>
                  {formData.storeIds.length === 0 && (
                    <p className="mt-1 text-xs text-red-400">
                      At least one store must be selected
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting || (formData.role !== "ADMIN" && formData.storeIds.length === 0)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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
                  className="px-4 py-2 sm:py-2.5 bg-slate-700/50 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 transition-all text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Users List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl border border-slate-700/50 hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3
                      className="font-semibold text-white text-sm sm:text-base md:text-lg truncate"
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
                <div className="flex gap-1.5 sm:gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(user)}
                    disabled={deletingUserId === user.id}
                    className="p-1.5 sm:p-2 text-slate-400 hover:text-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Edit user"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    disabled={deletingUserId === user.id}
                    className="p-1.5 sm:p-2 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={deletingUserId === user.id ? "Deleting..." : "Delete user"}
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
                  className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 border rounded-full ${getRoleColor(
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
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First User</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
