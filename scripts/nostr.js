const relayUrl = "wss://relay.damus.io"
let relay;
let events = [];
let nostr;
let notesContainer;

const newNoteEvent = new CustomEvent("newNoteEvent", { detail: { message: "New event!!!" }})

document.addEventListener('DOMContentLoaded', async () => {
  nostr = window.NostrTools
  console.log({nostr})
  
  relay = await nostr.Relay.connect(relayUrl)
  console.log(`Connected to ${relay.url}`, {relay})

  const btn = document.getElementById("npub-submit-input")
  btn.addEventListener('click', submitNpub)
})

window.addEventListener('newNoteEvent', (event) => {
  console.log(event.detail.message)
  notesContainer = document.getElementById('nostr-notes-container')
    const text = document.createElement('p');
    const latestNote = events.pop()
    if (latestNote.tags[1][3] === "reply") {
      text.textContent = "RE: " + latestNote.content
    } else {
      text.textContent = latestNote.content
    }
    // text.textContent = events.pop().content
    notesContainer.appendChild(text)
    notesContainer.children.l
})

function submitNpub() {
  console.log("clicked on submit npub")
  events = []
  if (notesContainer) {
    while(notesContainer.firstChild) {
      notesContainer.removeChild(notesContainer.lastChild)
    }
  }
  const input = document.getElementById("npub-input")
  const npub = input.value
  const hexPubKey = nostr.nip19.decode(npub).data
  relay.subscribe([
    {
      kinds: [1],
      authors: [hexPubKey],
    }
  ], {
    onevent(event) {
      console.log("got event: ", event)
      events.push(event)
      console.log(events)
      window.dispatchEvent(newNoteEvent)
    }
  })
}