export interface TextSample {
  id: number
  author: string
  excerpt: string
  imageUrl?: string
  videoUrl?: string
  averageSentenceLength: number
  conjunctionFrequency: number
  likesCount: number
  createdAt: string
  topic: 'Классика' | 'Поэзия' | 'Проза'
}
