const API = "http://127.0.0.1:8000/api";

export async function getProducts() {
  const res = await fetch(`${API}/products/`);
  if (!res.ok) throw new Error("Could not load products");
  return (await res.json()).products;
}

export async function submitOrder(payload) {
  const res = await fetch(`${API}/orders/`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Could not create order");
  return res.json();
}
