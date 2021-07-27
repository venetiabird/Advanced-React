export default function callTotalPrice(cart) {
  return cart.reduce((tally, cartItem) => {
    if (!cartItem.product) return tally; // products can be deleted even though theya re still in the cart
    return tally + cartItem.quantity * cartItem.product.price;
  }, 0);
}
