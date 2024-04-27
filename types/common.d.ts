interface SavedURL {
  id: number
  original_url: string
  short_url: string
  is_custom: boolean
}

export interface JsonDB {
  urls: Array<SavedURL>
}