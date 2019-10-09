/**
 * Модель данных для списка, разбитого на страницы
 */
export interface List<T> {
    /**
     * Общее количество элементов.
     */
    items: T[];
    /**
     * Информация о странице.
     */
    pageInfo: {
        resultsPerPage: number,
        totalResults: number
    };
    /**
     * Токен для следующей страницы загрузки.
     */
    nextPageToken: string,
  }
  