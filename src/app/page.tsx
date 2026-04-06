import HomePageView from "@/components/HomePageView";
import { genrePages } from "@/data/genres";
import { reviews } from "@/data/reviews";
import { loadRankingProducts, loadSaleProducts } from "@/lib/catalog";

function sortSalePreview(products: Awaited<ReturnType<typeof loadSaleProducts>>) {
  return [...products].sort((left, right) => {
    const leftDiscount = left.salePrice ? 1 - left.salePrice / left.price : 0;
    const rightDiscount = right.salePrice ? 1 - right.salePrice / right.price : 0;
    return rightDiscount - leftDiscount;
  });
}

export default async function HomePage() {
  const [rankingPreview, salePreview] = await Promise.all([
    loadRankingProducts({ limit: 3 }),
    loadSaleProducts({ limit: 3 }),
  ]);

  return (
    <HomePageView
      rankingPreview={rankingPreview}
      salePreview={sortSalePreview(salePreview)}
      featuredGenres={genrePages}
      featuredReviews={reviews.slice(0, 3)}
    />
  );
}
