/**
 * Модель данных для элементов видео в списке.
 */
export interface Video {
    snippet: {
        title: string,
        thumbnails: {
            default: {
                url: string
            }
        }
    }
}
