import axiosClient from "../axiosClient";


// Get all categories
async function getCategories() {
  try {
    const response = await axiosClient.get('api/categoriesServer');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return null;
  }
}

async function deleteCategory(id: string) {
  try {
    const response = await axiosClient.delete(`api/categoriesServer?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete category:', error);
    return null;
  }
}

export { getCategories, deleteCategory };