const $listUrls = document.querySelector("#list-urls")
const $container = document.querySelector("#container")
const $form = document.querySelector("#delete-url")

const allCookies = document.cookie
const authCookie = allCookies.split("; ").find((c) => c.startsWith("token_jwt="))?.split("=")[1]

if(!authCookie) {
  window.location.replace("/auth")
}

let URLS = []

try {
  const res = await fetch("/api/urls", {
    headers: {
      "Authorization": authCookie
    }
  })

  if(!res.ok) {
    window.location.replace(`/urls?status=${res.status}&message=${res.statusText}`)
  }

  const json = await res.json()

  URLS = json?.urls ?? []
} catch (err) {
  console.log(err.message)

  const $p = document.createElement("p")
  $p.innerHTML = err.message

  $container.appendChild($p)
}

if(URLS.length === 0) {
  if($form) {
    $container.removeChild($form)
  }
  const $p1 = document.createElement("p")
  const $p2 = document.createElement("p")
  $p1.innerHTML = "You dont have url's."
  $p2.innerHTML = 'Please go to the "cut your url" section'
  
  $container.appendChild($p1)
  $container.appendChild($p2)
}

URLS.forEach(url => {
  const $li = document.createElement("li")

  $li.innerHTML = `
    <li style="display: flex; gap: 16px; align-items: center;">
      <input type="radio" name="hash_id" value="${url.hash}"/>
      <div style="display: flex; flex-direction: column;">
        <a href=${url.short_url}>${url.short_url}</a>
        <small> (${url.original_url})</small>
      </div>
    </li>
  `
  $listUrls.appendChild($li)
})

// DELETE
$form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const formData = new FormData($form)
  const hashId = formData.get("hash_id")

  if(!hashId) {
    window.location.replace("/urls?status=400&message='Bad request, hash_id is required'")
  }

  try {
    const res = await fetch(`/api/urls/${hashId}`, {
      method: "DELETE",
      headers: {
        "Authorization": authCookie
      },
    })

    const statusCode = res.status
    const json = await res.json()
    const { message } = json
    const parsedMessage = message.split(" ").join("-").toLowerCase()

    window.location.replace(`/urls?status=${statusCode}&message=${parsedMessage}`)
  } catch (err) {
    console.log(err.message)
    throw new Error(err)
  }
})