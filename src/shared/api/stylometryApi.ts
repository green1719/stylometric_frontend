import { Api, type SerializerSampleResponseDTO } from './generated/stylometryApi'
import type { TextSample } from '../../types/sample'

export const stylometryApi = new Api<string>({
  baseURL: '/',
  securityWorker: (accessToken) => accessToken
    ? { headers: { Authorization: `Bearer ${accessToken}` } }
    : {},
})

export function mapStylometrySample(dto: SerializerSampleResponseDTO): TextSample {
  return {
    id: dto.stylometry_sample_id ?? 0,
    author: dto.stylometry_sample_text_creator?.trim() || 'Автор не указан',
    excerpt: dto.stylometry_sample_descr?.trim() || 'Описание отсутствует',
    imageUrl: dto.stylometry_sample_image_url,
    videoUrl: dto.stylometry_sample_video_url,
    averageSentenceLength: dto.stylometry_sample_average_sentence_length ?? 0,
    conjunctionFrequency: dto.stylometry_sample_conjunction_frequency ?? 0,
    likesCount: dto.stylometry_sample_likes_count ?? 0,
    createdAt: dto.stylometry_sample_created_at ?? new Date(0).toISOString(),
    // The backend does not store the presentational topic. It is retained only
    // for the existing local filter and does not alter the API response.
    topic: 'Проза',
    isLiked: dto.is_liked === 1,
    isCurrentUserCreator: dto.stylometry_sample_is_current_user_creator === 1,
  }
}
