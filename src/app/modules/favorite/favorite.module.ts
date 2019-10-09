import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FavoriteListComponent } from "./components/favorite-list/favorite-list.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";

/**
 * Модуль для взаимодействия со списком значений.
 */
@NgModule({
  declarations: [FavoriteListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule
  ],
  exports: [FavoriteListComponent]
})
export class FavoriteModule {}
