import MainLayout from '@/components/layouts/MainLayout';
import RestaurantFeed from '@/components/RestaurantFeed';

export default function Home() {
  return (
    <MainLayout>
      <RestaurantFeed />
    </MainLayout>
  );
}