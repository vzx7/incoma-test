import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Subscription } from "rxjs";
import { map, startWith, tap } from "rxjs/operators";
import { ApiService } from "src/app/core/services/api.service";
import { Video } from "../../models/video";
import { List } from "../../models/list";

/**
 * @title Component для работы со списом видео.
 */
@Component({
  selector: "app-favorite-list",
  templateUrl: "./favorite-list.component.html",
  styleUrls: ["./favorite-list.component.scss"]
})
export class FavoriteListComponent implements OnInit, OnDestroy {
  /**
   * Контрол формы для поиска по строке.
   */
  public favoriteInput = new FormControl();

  /**
   * Массив Video для отображения на странице.
   */
  public itemList: Array<Video>;

  /**
   * Массив Video полученных с сервера.
   */
  public etalonList: Array<Video>;

  /**
   * Токен для получения следующей страницы данных с youtube.
   */
  private nextPageToken: string;

  /**
   * Объект подписки для события изминения поискового инпута.
   */
  private favoriteInputSubscription: Subscription;

  /**
   * Хранилище найденных по поиску Video.
   */
  private favoriteStorage: Array<Video>;

  constructor(private readonly apiService: ApiService) {
    this.itemList = [];
    this.etalonList = [];
  }

  ngOnInit() {
    this.favoriteInputSubscription = this.favoriteInput.valueChanges
      .pipe(
        startWith(""),
        map(value => this._getSearchElements(value.toLowerCase()))
      )
      .subscribe(result => {
        this.itemList = result;
        if (result.length !== 0) {
          localStorage.setItem('favorites', JSON.stringify(result));
        }
      });

    this._setFavoriteStorage();
    this._setList();
  }

  /**
   * Получить следующий набор Video.
   */
  public getAnother(): void {
    this._setList(true);
  }

  /**
   * Получить следующий набор Video.
   */
  public showFavorites(): void {
    this._setFavoriteStorage();
    this.itemList = this.favoriteStorage.slice();
  }

  /**
   * Показать все записи полученные с сервера.
   */
  public showAll(): void {
    this.itemList = this.etalonList;
  }

  /**
   * Фильтрация по массиву записей полученных с сервера. 
   * @param searchValue 
   */
  private _getSearchElements(searchValue: string): Video[] {

    return this.etalonList.filter(video =>
      video.snippet.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  /**
   * Получить список видео из канала.
   * @param isGetNew если нужны новые.
   */
  private _setList(isGetNew = false): void {
    let url =
      '?part=snippet&channelId=UCE9ODjNIkOHrnSdkYWLfYhg&maxResults=50&order=viewCount';
    if (isGetNew) {
      url += `&pageToken=${this.nextPageToken}`;
    }

    this.apiService
      .get(url)
      .pipe(
        tap((response: List<Video>) => {
          if (this.favoriteStorage && !isGetNew) {
            this.etalonList = this.favoriteStorage;
          } else {
            this.etalonList = this.etalonList.concat(response.items);
          }
        })
      )
      .subscribe((response: List<Video>) => {
        this.nextPageToken = response.nextPageToken;
        if (this.favoriteStorage) {
          this.itemList = isGetNew
            ? this.favoriteStorage.concat(response.items)
            : this.favoriteStorage;
        } else {
          this.itemList = response.items;
        }
      });
  }

  /**
   * Настроить хранилище найденных элементов.
   */
  private _setFavoriteStorage(): void {
    const favoriteList = localStorage.getItem("favorites");
    if (favoriteList) {
      this.favoriteStorage = JSON.parse(favoriteList);
    }
  }

  /**
   * Отписка на дестрой.
   */
  ngOnDestroy(): void {
    this.favoriteInputSubscription.unsubscribe();
  }
}
