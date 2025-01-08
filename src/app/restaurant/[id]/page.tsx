import { use } from 'react';
import RestaurantDetail from '@/components/RestaurantDetail';

export default function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  return <RestaurantDetail id={resolvedParams.id} />;
}