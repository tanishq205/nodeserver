var socket = io('http://localhost:8000', { transports: ['websocket', 'polling', 'flashsocket'] });

const msg_form = document.getElementById('send-container');
const start_form = document.getElementById('start-chat');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
const toggle = document.getElementById('toggle');
var audio = new Audio('ting.mp3');

const append_msg = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}

function sleep(miliseconds) {
    var currentTime = new Date().getTime();
 
    while (currentTime + miliseconds >= new Date().getTime()) {
    }
 }

start_form.addEventListener('submit', (e) => {
    e.preventDefault();
    toggle.style.display = "block";
    start_form.style.display = "none";


    msg_form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (messageInput.value == "") {
            alert("you can't send blank msg")
        } else {
            const message = messageInput.value;
            append_msg(`You: ${message}`, 'right');
            socket.emit('send', message);
            messageInput.value = "";
        }

    })

    const nam = prompt("Enter your name to join");
    document.getElementById('h1').innerText = `Welcome ${nam}, Happy chating!!!`
    socket.emit('new-user-joined', nam);

    socket.on('user-joined', nam => {
        append_msg(`${nam} joined the chat`, 'left')
    })

    socket.on('receive', data => {
        append_msg(`${data.name}: ${data.message}`, 'left')
    })

    socket.on('left', name => {
        append_msg(`${name} left the chat`, 'left')
    })

})