import api from "./axios";
import type { Category } from "../types/category";

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get("/categories");

  return data.categories ?? [];
};

export const createCategory = async (payload: {
  name: string;
  description?: string;
}): Promise<Category> => {
  const { data } = await api.post("/categories", payload);

  return data.category;
};

export const updateCategory = async (
  id: string,
  payload: {
    name?: string;
    description?: string;
  },
): Promise<Category> => {
  const { data } = await api.patch(`/categories/${id}`, payload);

  return data.category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};
