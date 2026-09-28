import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BRAND } from '../utils/constants'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      showLogin: false,
      loginIntent: null,
      openLogin: (intent = null) => set({ showLogin: true, loginIntent: intent }),
      closeLogin: () => set({ showLogin: false, loginIntent: null }),
      login: ({ name, phone, role }) => {
        const user = {
          id: `usr-${Date.now()}`,
          name: name || 'Demo User',
          phone: phone || '+91 98XXX 00000',
          role: role || 'buyer',
          verifiedSeller: false,
        }
        set({ user, showLogin: false })
        return user
      },
      logout: () => set({ user: null }),
      clearLoginIntent: () => set({ loginIntent: null }),
      requireAuth: (intent) => {
        if (get().user) return true
        set({ showLogin: true, loginIntent: intent || null })
        return false
      },
      updateUser: (patch) => set({ user: { ...get().user, ...patch } }),
      demoOtp: BRAND.otp,
    }),
    { name: 'nestora_auth' },
  ),
)

export const useShortlistStore = create(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const ids = get().ids
        set({ ids: ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id] })
      },
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    { name: 'nestora_shortlist' },
  ),
)

export const useSavedSearchStore = create(
  persist(
    (set, get) => ({
      searches: [],
      add: (search) => {
        const entry = {
          id: `ss-${Date.now()}`,
          createdAt: new Date().toISOString(),
          frequency: 'daily',
          ...search,
        }
        set({ searches: [entry, ...get().searches] })
        return entry
      },
      update: (id, patch) =>
        set({ searches: get().searches.map((s) => (s.id === id ? { ...s, ...patch } : s)) }),
      remove: (id) => set({ searches: get().searches.filter((s) => s.id !== id) }),
    }),
    { name: 'nestora_saved_searches' },
  ),
)

export const useEnquiryStore = create(
  persist(
    (set, get) => ({
      enquiries: [],
      add: (enquiry) => {
        const entry = {
          id: `enq-${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: 'new',
          notes: '',
          ...enquiry,
        }
        set({ enquiries: [entry, ...get().enquiries] })
        return entry
      },
      update: (id, patch) =>
        set({ enquiries: get().enquiries.map((e) => (e.id === id ? { ...e, ...patch } : e)) }),
    }),
    { name: 'nestora_enquiries' },
  ),
)

export const useVisitStore = create(
  persist(
    (set, get) => ({
      visits: [],
      add: (visit) => {
        const entry = {
          id: `vis-${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: 'requested',
          ...visit,
        }
        set({ visits: [entry, ...get().visits] })
        return entry
      },
      update: (id, patch) =>
        set({ visits: get().visits.map((v) => (v.id === id ? { ...v, ...patch } : v)) }),
    }),
    { name: 'nestora_visits' },
  ),
)

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      items: [
        {
          id: 'n-welcome',
          title: 'Welcome to Nestora',
          body: 'Explore homes across Hyderabad, Bengaluru, Mumbai, Pune and Delhi NCR.',
          read: false,
          createdAt: new Date().toISOString(),
        },
      ],
      add: (item) =>
        set({
          items: [
            {
              id: `n-${Date.now()}`,
              read: false,
              createdAt: new Date().toISOString(),
              ...item,
            },
            ...get().items,
          ],
        }),
      markRead: (id) =>
        set({ items: get().items.map((n) => (n.id === id ? { ...n, read: true } : n)) }),
      markAllRead: () => set({ items: get().items.map((n) => ({ ...n, read: true })) }),
      unreadCount: () => get().items.filter((n) => !n.read).length,
    }),
    { name: 'nestora_notifications' },
  ),
)

export const useToastStore = create((set, get) => ({
  toasts: [],
  push: (toast) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    set({ toasts: [...get().toasts, { id, duration: 3200, ...toast }] })
    setTimeout(() => get().dismiss(id), toast.duration || 3200)
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))

export const useDraftStore = create(
  persist(
    (set, get) => ({
      draft: null,
      saveDraft: (draft) => set({ draft: { ...draft, savedAt: new Date().toISOString() } }),
      clearDraft: () => set({ draft: null }),
      getDraft: () => get().draft,
    }),
    { name: 'nestora_post_draft' },
  ),
)

export const useCompareStore = create((set, get) => ({
  ids: [],
  toggle: (id) => {
    const ids = get().ids
    if (ids.includes(id)) set({ ids: ids.filter((x) => x !== id) })
    else if (ids.length >= 3) return false
    else set({ ids: [...ids, id] })
    return true
  },
  clear: () => set({ ids: [] }),
}))
