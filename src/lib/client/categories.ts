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

export { getCategories };