const relayUrl = "wss://relay.damus.io"
const npub = "npub19u6u0h9pwg8k63e9f535enqdkgzl8wqzwzlnrtnwr853wt4ypszsapm6e6"
let relay;
let events = [];

const newNoteEvent = new CustomEvent("newNoteEvent", { detail: { message: "New event!!!" }})

document.addEventListener('DOMContentLoaded', async () => {
  const nostr = window.NostrTools
  console.log({nostr})
  
  relay = await nostr.Relay.connect(relayUrl)
  console.log(`Connected to ${relay.url}`, {relay})
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
})

window.addEventListener('newNoteEvent', (event) => {
  console.log(event.detail.message)
  const notesContainer = document.getElementById('nostr-notes-container')
    const text = document.createElement('p');
    const latestNote = events.pop()
    if (latestNote.tags[1][3] === "reply") {
      text.textContent = "RE: " + latestNote.content
    } else {
      text.textContent = latestNote.content
    }
    // text.textContent = events.pop().content
    notesContainer.appendChild(text)
})