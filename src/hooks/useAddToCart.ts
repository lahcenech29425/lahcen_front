import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

export function useAddToCart() {
  const { addToCart } = useCart();

  function handleAddToCart(product: Product, quantity: number = 1) {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url,
      slug: product.slug,
      quantity,
    });
  }

  return { handleAddToCart };
}