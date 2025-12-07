const API = "http://127.0.0.1:8000/api/auth";

export const authService = {
  async register(data: {
    email: string;
    full_name: string;
    password: string;
    password2: string;
  }) {
    const res = await fetch(`${API}/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async login(email: string, password: string) {
    const res = await fetch(`${API}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (data.access) {
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
    }

    return data;
  },

  async getCurrentUser() {
    const token = localStorage.getItem("access");
    const res = await fetch(`${API}/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) return null;
    return res.json();
  },

  logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  },
};
