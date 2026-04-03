import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('cn_user') || 'null'),
  token: localStorage.getItem('cn_token') || null,

  get isAuthenticated() {
    return !!this.token;
  },

  login: (data) => {
    localStorage.setItem('cn_token', data.token);
    localStorage.setItem('cn_user', JSON.stringify({
      _id: data._id,
      name: data.name,
      email: data.email,
    }));
    set({
      token: data.token,
      user: { _id: data._id, name: data.name, email: data.email },
    });
  },

  logout: () => {
    localStorage.removeItem('cn_token');
    localStorage.removeItem('cn_user');
    set({ token: null, user: null });
  },
}));

export default useAuthStore;
