import { Component, OnInit, ElementRef } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-previous-chats',
  templateUrl: './previous-chats.component.html',
  styleUrls: ['./previous-chats.component.css'],
})
export class PreviousChatsComponent {
  title = 'chatGTPClient';
  loadinterval: any;
  bot = './assets/bot.svg';
  user = './assets/user.svg';

  form: any;
  container: any;

  constructor(private elementref: ElementRef, private route: ActivatedRoute) {}

  ngAfterViewInit() {
    this.form = this.elementref.nativeElement.querySelector('form');
    this.form.addEventListener('submit', this.handlesubmit);
    this.form.addEventListener('keyup', (e: any) => {
      if (e.keycode === 13) {
        this.handlesubmit(e);
      }
    });
    this.container = this.elementref.nativeElement.querySelector('#container');

    this.route.queryParams.subscribe((params) => {
      const categoryName = params['categoryName'];
      const userName = params['username'];
      this.loadPreviousChats(categoryName, userName);
    });
  }

  // Load the previous chat associated with the username and his title
  loadPreviousChats(categoryName: any, userName: any) {
    this.container.innerHTML = '';
    const apiUrl =
      'https://manoharvellala.pythonanywhere.com/getQuestionAndAnswer';
    const requestBody = {
      username: userName, //here send username from the navbar
      title: categoryName,
    };

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        // Loop through the chat data and generate HTML elements
        data.forEach((chat: any) => {
          // Explicitly define the type as 'any'
          const questionWrapperDiv = document.createElement('div');
          questionWrapperDiv.className = `wrapper`;

          const questionChatDiv = document.createElement('div');
          questionChatDiv.className = 'chat';

          const questionProfileDiv = document.createElement('div');
          questionProfileDiv.className = 'profile';
          const questionProfileImg = document.createElement('img');
          questionProfileImg.src = this.user; // Question logo
          questionProfileDiv.appendChild(questionProfileImg);

          const questionDiv = document.createElement('div');
          questionDiv.className = 'message';
          const questionUniqueId = uuidv4(); // Generate a unique ID for the question
          questionDiv.id = questionUniqueId;
          questionDiv.innerText = chat.question;

          questionChatDiv.appendChild(questionProfileDiv);
          questionChatDiv.appendChild(questionDiv);

          questionWrapperDiv.appendChild(questionChatDiv);

          const answerWrapperDiv = document.createElement('div');
          answerWrapperDiv.className = `wrapper ai`;

          const answerChatDiv = document.createElement('div');
          answerChatDiv.className = 'chat';

          const answerProfileDiv = document.createElement('div');
          answerProfileDiv.className = 'profile';
          const answerProfileImg = document.createElement('img');
          answerProfileImg.src = this.bot; // Answer logo
          answerProfileDiv.appendChild(answerProfileImg);

          const answerDiv = document.createElement('div');
          answerDiv.className = 'message';
          const answerUniqueId = uuidv4(); // Generate a unique ID for the answer
          answerDiv.id = answerUniqueId;
          answerDiv.innerText = chat.answer;

          answerChatDiv.appendChild(answerProfileDiv);
          answerChatDiv.appendChild(answerDiv);

          answerWrapperDiv.appendChild(answerChatDiv);

          this.container.appendChild(questionWrapperDiv);
          this.container.appendChild(answerWrapperDiv);
        });
      })
      .catch((error) => {
        console.error('Error loading previous chats:', error);
      });
  }

  // handling three dots ; bot thinking
  loader(element: any) {
    element.textContent = '';
    this.loadinterval = setInterval(() => {
      element.textContent += '.';
      if (element.textContent === '....') {
        element.textContent = '';
      }
    }, 300);
  }

  //to show one word typeing at a time by bot
  typetext(element: any, text: any) {
    let index = 0;

    let interval = setInterval(() => {
      if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);
  }

  generateUniqueId() {
    const timestamp = Date.now();
    const rnNumber = Math.random();
    const hex = rnNumber.toString(16);
    return `id-${timestamp}-${hex}`;
  }

  //color variation of grey for bot and user
  stripes(ai: any, value: any, uniqueId: any) {
    return `
      <div class= "wrapper ${ai && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img src="${ai ? this.bot : this.user}"/>
          </div>
          <div class="message" id=${uniqueId}>${value}</div>
        </div>
      </div>
      `;
  }

  handlesubmit = async (e: any) => {
    e.preventDefault();

    const data = new FormData(this.form ?? undefined);

    // user stripes
    if (this.container != null) {
      this.container.innerHTML += this.stripes(false, data.get('prompt'), null);
    }
    // bot stripes
    const uniqueId = this.generateUniqueId();
    if (this.container != null) {
      this.container.innerHTML += this.stripes(true, ' ', uniqueId);
      this.container.scrollTop = this.container?.scrollHeight;
    }

    const messageDiv = document.getElementById(uniqueId);
    this.loader(messageDiv);
    const categoryName = this.route.snapshot.queryParams['categoryName'];
    const userName = this.route.snapshot.queryParams['username'];
    // fetch the data from serve

    const response = await fetch(
      'https://manoharvellala.pythonanywhere.com/chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: data.get('prompt'),
          username: userName,
          title: categoryName,
        }),
      }
    );

    clearInterval(this.loadinterval);
    if (messageDiv != null) {
      messageDiv.innerHTML = '';
    }

    if (response.ok) {
      const data = await response.json();
      const parseddata = data;

      this.typetext(messageDiv, parseddata);
    } else {
      const err = await response.text();
      if (messageDiv != null) {
        messageDiv.innerHTML = 'Something went wrong';
        alert(err);
      }
    }
  };
}
