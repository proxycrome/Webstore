import { Component, OnInit } from "@angular/core";
import { Cart, CartItem } from "../../models/cart.model";
import { CartService } from "src/app/services/cart.service";
import { PaystackOptions } from 'angular4-paystack';
import { environment as environment_prod } from "src/environments/environment";
import { environment } from "src/environments/environment.development";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
})
export class CartComponent implements OnInit {
  cart!: Cart;
  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    "product",
    "name",
    "price",
    "quantity",
    "total",
    "action",
  ];
  title!: string;

  options!: PaystackOptions 

  constructor(
    private cartService: CartService,
    private router: Router, 
    private _snackbar: MatSnackBar
  ) {}

  paymentInit() {
    console.log('Payment initialized');
  }

  paymentDone(ref: any) {
    this.cartService.clearCart();
    this.router.navigate(['/home'])
  }

  paymentCancel() {
    this._snackbar.open('Payment failed', 'Ok', {duration: 5000});
  }

  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart?.items;
      this.options = {
        amount: this.getTotal(this.cart?.items) * 100,
        email: 'e.v.ezeonwuka@gmail.com',
        ref: `${Math.ceil(Math.random() * 10e10)}`
      }
    });
  }  

  getTotal(items: CartItem[]): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.decrementQuantity(item);
  }
}
