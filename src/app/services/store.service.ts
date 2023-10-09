import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Product } from "../models/product.model";

const STORE_BASE_URL = "https://api.escuelajs.co";

interface ProductResponseData {
  id: number;
  title: string;
  price: number;
  description: string;
  images?: string[];
  creationAt?: Date;
  updatedAt?: Date;
  category: {
    id: number;
    name: string;
    image: string;
    creationAt: Date;
    updatedAt: Date;
  };
}

export interface CategoryResponseData {
  id: number;
  name: string;
  image: string;
}

@Injectable({
  providedIn: "root",
})
export class StoreService {
  constructor(private httpClient: HttpClient) {}

  getAllProducts(limit = 12, sort = "desc", category?: number): Observable<Product[]> {
    return this.httpClient
      .get<ProductResponseData[]>(
        `${STORE_BASE_URL}/api/v1${
          category ? '/categories/' + category : ''
        }/products?offset=0&limit=${limit}&sort=${sort}`
      )
      .pipe(
        map((response) => {
          let products: Product[] = [];
          for (let data of response) {
            products.push({
              id: data.id,
              title: data.title,
              price: data.price,
              category: data.category.name,
              description: data.description,
              image: data?.images?.[0],
            });
          }
          return products;
          // return
        })
      );
  }

  getAllCategories(): Observable<CategoryResponseData[]> {
    return this.httpClient
      .get<CategoryResponseData[]>(`${STORE_BASE_URL}/api/v1/categories`)
  }
}
