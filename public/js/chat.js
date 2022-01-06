const socket = io()

// elments
const $MessageForm = document.querySelector('#message-form')
const $MessageFormInput = $MessageForm.querySelector('input')
const $MessageFormButton = $MessageForm.querySelector('button')
const $LocationFormButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// template
const MessageTemplate = document.querySelector('#message-template').innerHTML
const LocationTemplate = document.querySelector('#location-template').innerHTML
const SideBarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () => {
    // new message element
    const $newMessage = $messages.lastElementChild

    // Height of the message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // visible height
    const visibleHeight = $messages.offsetHeight
    
    //  height of the container message
    const ContainerHeight = $messages.scrollHeight

    // How far can we Scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(ContainerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }

}

socket.on('message', (message) => {
    console.log(message)

    const html = Mustache.render(MessageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('LocationMessage', (url) => {
    console.log(url)
    
    const html = Mustache.render(LocationTemplate, {
        username: url.username,
        url: url.locationurl,
        createdAt: moment(url.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({users, room}) => {
    const html = Mustache.render(SideBarTemplate, {
        users,
        room
    })
    document.querySelector('#sidebar').innerHTML = html
})

$MessageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const message = e.target.elements.message.value

    $MessageFormButton.setAttribute('disabled', 'disabled')

    socket.emit('sendmessage', message, (error) => {

        $MessageFormButton.removeAttribute('disabled')
        $MessageFormInput.value = ''
        $MessageFormButton.focus()

        if(error){
            return console.log(error)
        }
        console.log('Message delivered!')
    })
})

$LocationFormButton.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }

    $LocationFormButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition(position => {

        socket.emit('sendLocation', {
            'latitude': position.coords.latitude,
            'longitude': position.coords.longitude
        }, () => {
            $LocationFormButton.removeAttribute('disabled')
            console.log('location shared!')
        })
    })

})

socket.emit('join', {username, room}, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})