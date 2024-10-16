import { Category } from '@/lib/interfaces/interface';
import '../../../globals.css'; // Ensure this path is correct
import NewCategory from '@/components/categoryPage/NewCategory';
import { getCategoryById } from '@/lib/client/categories';

async function fetchCategoryById(id: string): Promise<Category | null> {
    try {
      const data = await getCategoryById(id);
      if (!data) {
        return null; // Ensure we return null if data is not found
      }
      return data;
    } catch (error) {
      console.error('Error fetching anime:', error);
      return null; // Handle error by returning null
    }
  }

export default async function CreatingNewCategory({ params }: { params: { id: string } }) {
    const { id } = params;
    const category = await fetchCategoryById(id);
  return (
    <>
    <div className=" bg-custom-blue-dark">
      <NewCategory category={category}/>
    </div>
    </>
  );
}