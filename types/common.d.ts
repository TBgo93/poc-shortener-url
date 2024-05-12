export interface SavedURL {
  id: number
  original_url: string
  short_url: string
  is_custom: boolean
  hash: string
}

export type Payload = {
  url: FormDataEntryValue
  custom_path?: FormDataEntryValue
}

export interface JsonDB {
  urls: Array<SavedURL>
}

export type GetJson = { 
  urls: SavedURL[] 
}

export type DeleteJson = {
  message: string
}

export type PostJson = CreatedResource | ConflitToSave

export type ConflitToSave = {
  statusCode: 409 | 500
  json: {
    message: string
    resource: string
  }
}

export type CreatedResource = {
  statusCode: 200
  json: {
    url: string
    short_url: string
  }
}

export type ResponseService<T> = [
  error: null,
  response: T
] | [
  error: Error,
  response: null
]
