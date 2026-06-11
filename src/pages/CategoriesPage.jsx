import CategorySection from "../components/CategorySection";

const CategoriesPage = () => {
  return (
    <div className="theme-page-bg min-h-screen px-3 pb-10 pt-24 md:px-6">
      <div className="mx-auto max-w-[1280px]">
        <CategorySection limit={999} showViewAll={false} />
      </div>
    </div>
  );
};

export default CategoriesPage;
