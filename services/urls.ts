import { SavedURL, Payload, ResponseService, GetJson, DeleteJson, PostJson } from "@/types/common.d.ts";


const getAllUrls = async (host: string, authCookie: string): Promise<ResponseService<SavedURL[]>> => {
  try {
    const res = await fetch(`${host}/api/urls`, {
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


const deleteUrlByHashid = async (host: string, authCookie: string, hash: string): Promise<ResponseService<DeleteJson>> => {
  try {
    const res = await fetch(`${host}/api/urls/${hash}`, {
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

const saveUrl = async (host: string, authCookie: string, payload: Payload): Promise<ResponseService<PostJson>> => {
  try {
    const res = await fetch(`${host}/api/urls/cut`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authCookie
      },
      body: JSON.stringify(payload)
    })

    const json = await res.json()
    const statusCode = res.status as 409 | 500

    return [null, { statusCode: res.ok ? 200 : statusCode, json }]
  } catch (err) {
    console.log(err)
    const errorMessage = err.message

    return [errorMessage, null]
  }
}

export { getAllUrls, deleteUrlByHashid, saveUrl }
