import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Сервис обработки запросов
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  /**
   * Заголовки
   */
  private readonly header: any;

  /**
   * Хост для api
   */
  private host: string;

  /**
   * Key для youtube
   */
  private key: string;

  constructor(private readonly httpClient: HttpClient) {
    this.header = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    this.host = environment.host;
    this.key = `&key=${environment.key}`;
  }


  /**
   * Запрос GET.
   * @param url Урл.
   * @param complete Функция, которая вызывается в любом случае
   * @param headers Поля заголовков.
   * @return Вернет Observable объекта ответа.
   */
  public get<T>(
    url: string,
    complete?: Function,
    headers?: Object,
  ): Observable<T> {
    return this.httpClient
      .get<T>(this.host + url + this.key, {
        headers: headers || this.header,
      })
      .pipe(finalize(complete && complete()));
  }

  /**
   * Запрос PUT.
   * @param url Урл.
   * @param body Тело запроса.
   * @param complete Функция, которая вызывается в любом случае
   * @param headers Поля заголовков.
   * @return Вернет Observable объекта ответа.
   */
  public put<T>(
    url: string,
    body?: Object,
    complete?: Function,
    headers?: Object,
  ): Observable<T> {
    return this.httpClient
      .put<T>(this.host + url, body, {
        headers: headers || this.header,
      })
      .pipe(finalize(complete && complete()));
  }

  /**
   * Получить файл.
   * @param url Урл.
   * @param complete Функция, которая вызывается в любом случае
   * @param querryParams Параметры запроса.
   * @return Observable типа
   */
  public getBlobRest<T>(
    url: string,
    complete?: Function,
    querryParams?: string,
  ): Observable<T | any> {
    return this.httpClient
      .get(this.host + url, {
        params: new HttpParams({ fromString: querryParams }),
        headers: this.header,
        responseType: 'blob',
      })
      .pipe(
        map((res: any) => {
          return new Blob([res]);
        }),
      )
      .pipe(finalize(complete()));
  }

  /**
   * Формирование query параметра для GET.
   * @param params Объект с параметрами.
   * @return Вернет строку запроса.
   */
  public prepareGetParams(params: Object): string {
    let query = '';
    let first = true;
    for (const paramKey in params) {
      if (params.hasOwnProperty(paramKey)) {
        query += `${first ? '' : '&'}${paramKey}=${params[paramKey]}`;
        first = false;
      }
    }
    
    return query;
  }

  /**
   * Формируем заголовки для отправки
   * @return Заголовки
   */
  public setHeadersForMultipartFormData(): HttpHeaders {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return headers;
  }
}