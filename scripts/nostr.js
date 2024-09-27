const { clearProfile, clearNotes, renderProfile, renderNotes } = require("./utils")
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
  relay = await nostr.Relay.connect(relayUrl)
  console.log(`Connected to ${relay.url}`, {relay})

  const hash = window.location.hash
  if (hash !== "" && hash.startsWith("#npub")) {
    loadNpubFromHash(hash.slice(1))
  }

  const btn = document.getElementById("npub-submit-input")
  btn.addEventListener('click', submitNpub)
})

window.addEventListener('newNoteEvent', (event) => {
  notesContainer = document.getElementById('nostr-notes-container')
  const latestNote = events.pop()
  switch (latestNote.kind) {
    case 0:
      renderProfile(latestNote)
      break;
      case 1:
        renderNote(latestNote)
      break;
  }
})

function submitNpub() {
  clearNotes()
  const input = document.getElementById("npub-input")
  const npub = input.value
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

function loadNpubFromHash(hash) {
  clearNotes()
  const input = document.getElementById("npub-input")
  const npub = hash;
  input.textContent = npub;
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