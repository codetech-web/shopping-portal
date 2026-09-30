from django.urls import path
from . import views

urlpatterns = [
    path("health/", views.health),
    path("products/", views.products),
    path("products/<int:product_id>/", views.product_detail),
    path("categories/", views.categories),
    path("orders/", views.orders),
]
