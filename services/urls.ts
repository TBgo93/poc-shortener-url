import { SavedURL } from "@/types/common.d.ts";

type GetJson = { 
  urls: SavedURL[] 
}

type DeleteJson = {
  message: string
}

type ResponseService<T> = [
  error: null,
  response: T
] | [
  error: Error,
  response: null
]


const getAllUrls = async (authCookie: string): Promise<ResponseService<SavedURL[]>> => {
  try {
    const res = await fetch("http://localhost:8787/api/urls", {
      headers: {
        "Authorization": authCookie
      }
    })

    if(!res.ok) {
      throw new Error(String("Status: " + res.status + "- message: " + res.statusText))
    }

    const json: GetJson = await res.json()
    const { urls } = json
  
    return [null, urls]
  } catch (err) {
    console.log(err)
    const errorMessage = err.message

    return [errorMessage, null]
  }
}


const deleteUrlByHashid = async (authCookie: string, hash: string): Promise<ResponseService<DeleteJson>> => {
  try {
    const res = await fetch(`http://localhost:8787/api/urls/${hash}`, {
      method: "DELETE",
      headers: {
        "Authorization": authCookie
      },
    })
    if(!res.ok) {
      throw new Error(String("Status: " + res.status + "- message: " + res.statusText))
    }

    const json = await res.json()
    return [null, json]
  } catch (err) {
    console.log(err)
    const errorMessage = err.message

    return [errorMessage, null]
  }
}

export { getAllUrls, deleteUrlByHashid }
