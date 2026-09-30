from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

PRODUCTS = [
    {"id": 1, "name": "AeroFlex Runner", "category": "Footwear", "price": 2499, "oldPrice": 3499, "rating": 4.8, "reviews": 342, "stock": 18, "badge": "BESTSELLER", "emoji": "👟", "accent": "violet", "description": "Lightweight everyday runners with responsive cushioning and a breathable knit upper."},
    {"id": 2, "name": "Nova Smart Watch", "category": "Electronics", "price": 4299, "oldPrice": 5999, "rating": 4.7, "reviews": 218, "stock": 11, "badge": "HOT", "emoji": "⌚", "accent": "cyan", "description": "A sleek fitness smartwatch with activity tracking, notifications and a vibrant display."},
    {"id": 3, "name": "CloudSoft Hoodie", "category": "Fashion", "price": 1899, "oldPrice": 2599, "rating": 4.6, "reviews": 185, "stock": 29, "badge": "TRENDING", "emoji": "🧥", "accent": "rose", "description": "Premium soft-fleece hoodie designed for comfort, travel and everyday streetwear."},
    {"id": 4, "name": "Orbit Backpack", "category": "Accessories", "price": 1599, "oldPrice": 2299, "rating": 4.5, "reviews": 129, "stock": 34, "badge": "NEW", "emoji": "🎒", "accent": "amber", "description": "Urban backpack with a laptop sleeve, organized pockets and water-resistant fabric."},
    {"id": 5, "name": "Pixel Pro Headphones", "category": "Electronics", "price": 3299, "oldPrice": 4499, "rating": 4.9, "reviews": 521, "stock": 9, "badge": "TOP RATED", "emoji": "🎧", "accent": "blue", "description": "Immersive wireless headphones with deep bass, low latency and all-day comfort."},
    {"id": 6, "name": "Minimal Desk Lamp", "category": "Home", "price": 999, "oldPrice": 1499, "rating": 4.4, "reviews": 96, "stock": 41, "badge": "DEAL", "emoji": "💡", "accent": "yellow", "description": "Minimal LED desk lamp with warm/cool lighting modes for study and work."},
    {"id": 7, "name": "Urban Sunglasses", "category": "Accessories", "price": 1199, "oldPrice": 1799, "rating": 4.3, "reviews": 77, "stock": 24, "badge": "STYLE", "emoji": "🕶️", "accent": "indigo", "description": "Polarized everyday sunglasses with a lightweight frame and modern silhouette."},
    {"id": 8, "name": "Ceramic Brew Set", "category": "Home", "price": 1399, "oldPrice": 1999, "rating": 4.7, "reviews": 143, "stock": 17, "badge": "POPULAR", "emoji": "☕", "accent": "orange", "description": "A contemporary ceramic coffee set for calm mornings and stylish countertops."},
    {"id": 9, "name": "StreetFit Sneakers", "category": "Footwear", "price": 2799, "oldPrice": 3899, "rating": 4.6, "reviews": 266, "stock": 15, "badge": "LIMITED", "emoji": "👞", "accent": "green", "description": "Street-inspired sneakers combining durable construction with lightweight comfort."},
    {"id": 10, "name": "Studio Mechanical Keyboard", "category": "Electronics", "price": 4599, "oldPrice": 6499, "rating": 4.8, "reviews": 301, "stock": 7, "badge": "PRO PICK", "emoji": "⌨️", "accent": "purple", "description": "Tactile mechanical keyboard with hot-swap switches and clean desktop aesthetics."},
    {"id": 11, "name": "Everyday Tote", "category": "Fashion", "price": 899, "oldPrice": 1299, "rating": 4.4, "reviews": 112, "stock": 38, "badge": "EASY PICK", "emoji": "👜", "accent": "pink", "description": "A roomy daily tote for college, work and quick weekend plans."},
    {"id": 12, "name": "Glow Skin Kit", "category": "Beauty", "price": 1699, "oldPrice": 2399, "rating": 4.7, "reviews": 198, "stock": 21, "badge": "GLOW", "emoji": "✨", "accent": "fuchsia", "description": "A simple self-care kit featuring everyday essentials for a fresh routine."},
]

CATEGORIES = ["All", "Electronics", "Fashion", "Footwear", "Accessories", "Home", "Beauty"]

ORDERS = [
    {"id": "SS-10482", "customer": "Aarav Kumar", "amount": 6898, "status": "Delivered", "date": "30 Sep 2026"},
    {"id": "SS-10481", "customer": "Meera S", "amount": 4299, "status": "Processing", "date": "30 Sep 2026"},
    {"id": "SS-10480", "customer": "Rohan P", "amount": 2499, "status": "Shipped", "date": "29 Sep 2026"},
    {"id": "SS-10479", "customer": "Diya R", "amount": 3299, "status": "Delivered", "date": "29 Sep 2026"},
]

def health(request):
    return JsonResponse({"status": "ok", "service": "ShopSphere API", "database": "not required"})

def products(request):
    return JsonResponse({"products": PRODUCTS, "count": len(PRODUCTS)})

def product_detail(request, product_id):
    product = next((p for p in PRODUCTS if p["id"] == product_id), None)
    if not product:
        return JsonResponse({"error": "Product not found"}, status=404)
    return JsonResponse(product)

def categories(request):
    return JsonResponse({"categories": CATEGORIES})

@csrf_exempt
def orders(request):
    if request.method == "GET":
        return JsonResponse({"orders": ORDERS})
    if request.method == "POST":
        try:
            body = json.loads(request.body.decode("utf-8"))
        except Exception:
            body = {}
        new_id = f"SS-{10500 + len(ORDERS)}"
        order = {
            "id": new_id,
            "customer": body.get("customer", "Guest"),
            "amount": body.get("amount", 0),
            "status": "Processing",
            "date": "30 Sep 2026",
        }
        ORDERS.insert(0, order)
        return JsonResponse({"success": True, "order": order}, status=201)
    return JsonResponse({"error": "Method not allowed"}, status=405)
