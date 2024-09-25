const relayUrl = "wss://relay.damus.io"
let relay;
let events = [];
let nostr;
let notesContainer;
let profileData = {
  picture: "",
  website: "",
  lud16: "",
  name: "",
  about: "",
  display_name: "",
  nip05: "",
}

const newNoteEvent = new CustomEvent("newNoteEvent", { detail: { message: "New event!!!" }})

document.addEventListener('DOMContentLoaded', async () => {
  nostr = window.NostrTools
  console.log({nostr})

  relay = await nostr.Relay.connect(relayUrl)
  console.log(`Connected to ${relay.url}`, {relay})

  const hash = window.location.hash
  console.log(hash)
  if (hash.startsWith("#npub")) {
    submitNpub(hash.slice(1))
  }

  const btn = document.getElementById("npub-submit-input")
  btn.addEventListener('click', submitNpub)
})

window.addEventListener('newNoteEvent', (event) => {
  notesContainer = document.getElementById('nostr-notes-container')
  const latestNote = events.pop()
  const tags = latestNote.tags
  
  switch (latestNote.kind) {
    case 0:
      const profilePicContainer = document.getElementById("profile-pic-container")
      profileData = JSON.parse(latestNote.content)

      const img = document.createElement('img')
      img.src = profileData.picture
      img.classList.add(["profile-pic"])

      const name = document.createElement('h2')
      name.textContent = profileData.display_name
      const desc = document.createElement('p')
      desc.textContent = profileData.about
      profilePicContainer.appendChild(img)
      const div = document.createElement('div')
      div.classList.add(['profile-info-container'])
      div.appendChild(name)
      div.appendChild(desc)
      profilePicContainer.append(div)
      break;
      case 1:
        const text = document.createElement('span');
        if (tags && tags[1] && tags[1][3] && tags[1][3] === "reply") {
          const replyNotice = document.createElement('a')
          const div = document.createElement('div')
          div.classList.add(['reply-note-container'])
          replyNotice.textContent = "reply:"
          text.textContent = latestNote.content
          div.appendChild(replyNotice)
          div.appendChild(text)
          notesContainer.appendChild(div)
        } else {
          text.textContent = latestNote.content
          notesContainer.appendChild(text)
        }
      break;
  }
})

function submitNpub(npubIn) {
  events = []
  if (notesContainer) {
    while(notesContainer.firstChild) {
      notesContainer.removeChild(notesContainer.lastChild)
    }
  }
  let npub;
  const input = document.getElementById("npub-input")
  if (npubIn) {
    npub = npubIn
    input.textContent = npubIn
  } else {
    npub = input.value
  }
  const hexPubKey = nostr.nip19.decode(npub).data
  relay.subscribe([
    {
      kinds: [0, 1],
      authors: [hexPubKey],
    }
  ], {
    onevent(event) {
      events.push(event)
      window.dispatchEvent(newNoteEvent)
    }
  })
}