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

async function updateCategory(formData: FormData) {
  try {
    const response = await axiosClient.put('api/categoriesServer', formData);
    return response.data;
  } catch (error) {
    console.error('Failed to update category:', error);
    return null;
  }
}

async function postCategory(formData: FormData) {
  try {
    const response = await axiosClient.post('api/categoriesServer', formData);
    return response.data;
  } catch (error) {
    console.error('Failed to post category:', error);
    return null;
  }
}

async function getCategoryById(id: string) {
  try {
    const response = await axiosClient.get(`api/categoriesServer?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch category:', error);
    return null;
  }
}

async function getSearchedCategory(search: string) {
  try {
    const response = await axiosClient.get(`api/categoriesServer?search=${search}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return null;
  }
}

export { getCategories, deleteCategory, updateCategory, postCategory, getCategoryById, getSearchedCategory };