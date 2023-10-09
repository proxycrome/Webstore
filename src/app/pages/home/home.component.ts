import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Product } from "src/app/models/product.model";
import { CartService } from "src/app/services/cart.service";
import { StoreService, CategoryResponseData } from "src/app/services/store.service";

const ROW_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 450 };

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styles: [],
})
export class HomeComponent implements OnInit, OnDestroy {
  cols = 3;
  category: number | undefined;
  rowHeight = ROW_HEIGHT[this.cols];
  products: Array<Product> | undefined;
  sort = "desc";
  limit = 12;
  productSubscription: Subscription | undefined;

  constructor(
    private cartService: CartService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productSubscription = this.storeService
      .getAllProducts(this.limit, this.sort, this.category)
      .subscribe((_products) => {
        this.products = _products;
      });
  }

  onColumnsCountChange(colsNum: number): void {
    this.cols = colsNum;
    this.rowHeight = ROW_HEIGHT[this.cols];
  }

  onShowCategory(newCategory: CategoryResponseData): void {
    this.category = newCategory.id;
    this.getProducts()
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id,
    });
  }

  onItemsCountChange(newCount: number): void {
    this.limit = newCount;
    this.getProducts();
  }

  onSortChange(newSort: string): void {
    this.sort = newSort
    this.getProducts();
  }

  ngOnDestroy(): void {
    if(this.productSubscription){
      this.productSubscription.unsubscribe();
    }
  }
}
