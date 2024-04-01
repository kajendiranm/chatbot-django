const input = document.querySelector('input')
const button = document.querySelector('svg')
const chatContainer = document.querySelector('.chat-container')
const inputContainer = document.querySelector('.input-container')

const getCookie= (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

function send() {
    if (input.value == "") return;
    let newEl = document.createElement('div')
    newEl.className = 'chats'
    newEl.innerHTML = `
        <img src="/static/chatbot/images/user.png" alt="user-img">
        <div class="content">
            <span class="owner">you</span>
            <p>${input.value}</p>
        </div>
    `
    inputContainer.insertAdjacentElement('beforebegin', newEl)
    let temp = input.value
    input.value = ''
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });


    $.ajax({
        type: 'POST',
        url: '/chat/',
        data:{
            'csrfmiddlewaretoken': csrftoken,
            'query': temp,
        },
        success: (response)=>{
            let newBotEl = document.createElement('div')
            newBotEl.className = 'chats'
            // let finalResponse = response.response
            // if(response.score < 0.50) 
            //     finalResponse = 'Please be more specific in the query!'
            newBotEl.innerHTML = `
            <img src="/static/chatbot/images/bot.jpg" alt="bot-img">
            <div class="content">
                <span class="owner">Bot</span>
                <p>${response.response  }</p>
            </div>
            `
            inputContainer.insertAdjacentElement('beforebegin', newBotEl)
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
            input.focus()

        },
        error: (error)=>{
            console.log(error)
        }
    })
}

button.addEventListener('click', send)

input.addEventListener('keydown', event => {
    if (event.keyCode === 13) {
        send()
    }
})
