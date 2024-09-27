function clearProfile() {
  profileData = {}
  const profilePicContainer = document.getElementById("profile-pic-container")
  if (profilePicContainer) {
    while(profilePicContainer.firstChild) {
      profilePicContainer.removeChild(profilePicContainer.lastChild)
    }
  }
}

function clearNotes() {
  events = []
  const notesContainerLocal = document.getElementById('nostr-notes-container')
  if (notesContainerLocal) {
    while(notesContainerLocal.firstChild) {
      notesContainerLocal.removeChild(notesContainerLocal.lastChild)
    }
  }
}

function renderProfile(latestNote) {
  profileData = {}
  clearProfile()
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
}

function renderNote(latestNote) {
  const tags = latestNote.tags
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
}

module.exports = {
  clearProfile,
  clearNotes,
  renderProfile,
  renderNote,
}