const allCookies = document.cookie
const authCookie = allCookies.split("; ").find((c) => c.startsWith("token_jwt="))?.split("=")[1]

if(!authCookie) {
  window.location.replace("/auth")
}

const $form = document.querySelector("#form-to-save")

$form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const formData = new FormData($form)
  const originalUrl = formData.get("original_url")
  const customPath = formData.get("custom_path")

  if(!originalUrl) {
    window.location.replace(`/cut-url?status=${400}&message=${"Bad request, original_url is required"}`)
  }

  const payload = {
    url: originalUrl
  }

  if(customPath) {
    payload.custom_path = customPath
  }

  try {
    const res = await fetch("/api/urls/cut", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authCookie
      },
      body: JSON.stringify(payload)
    })
  
    if(!res.ok) {
      const statusCode = res.status
      const json = await res.json()
      const { message } = json
      const parsedMessage = message.split(" ").join("-").toLowerCase()
      
      window.location.replace(`/cut-url?status=${statusCode}&message=${parsedMessage}`)
    } else {
      window.location.replace("/urls")
    }
  } catch (err) {
    console.log(err.message)
    throw new Error(err)
  }
})

