import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { StoreService, CategoryResponseData } from "src/app/services/store.service";

@Component({
  selector: "app-filters",
  templateUrl: "./filters.component.html",
})
export class FiltersComponent implements OnInit, OnDestroy {
  categories: CategoryResponseData[] | undefined;
  @Output() showCategory = new EventEmitter<CategoryResponseData>();
  categorySubscription: Subscription | undefined;

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.categorySubscription = this.storeService
      .getAllCategories()
      .subscribe((response) => {
        this.categories = response;
      });
  }

  onShowCategory(category: CategoryResponseData) {
    this.showCategory.emit(category);
  }

  ngOnDestroy(): void {
    if(this.categorySubscription){
      this.categorySubscription.unsubscribe();
    }
  }
}
