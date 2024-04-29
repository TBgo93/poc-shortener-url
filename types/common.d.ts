export interface SavedURL {
  id: number
  original_url: string
  short_url: string
  is_custom: boolean
  hash: string
}

export interface JsonDB {
  urls: Array<SavedURL>
}