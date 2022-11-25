import create from "zustand";
import { devtools, persist } from "zustand/middleware";

// ========== STATE INTERFACE ==========
export interface StoreState {
  schoolId: number | null;
  gradeId: number | null;
  setSchoolId: (id: number) => void;
  setGradeId: (id: number) => void;
}

// ========== STORE ==========
export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        schoolId: null,
        gradeId: null,
        setSchoolId: (id: number) => set({ schoolId: id }),
        setGradeId: (id: number) => set({ gradeId: id }),
      }),
      {
        name: `grademyaid-storage`,
      }
    )
  )
);
