import { AuthService } from '@auth0/auth0-angular';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  title = 'chatGTPClient';
  loadinterval: any;
  bot = './assets/bot.svg';
  user = './assets/user.svg';
  loggedInUser: any;

  form: any;
  container: any;
  navBarTitle: any;
  titleExist: any = false;
  reloadNavbar: boolean = true;
  loadSection: boolean = true;

  constructor(
    private elementref: ElementRef,
    private cdr: ChangeDetectorRef,
    public auth: AuthService
  ) {}

  ngAfterViewInit() {
    this.form = this.elementref.nativeElement.querySelector('form');

    this.form.addEventListener('submit', this.handlesubmit);
    this.form.addEventListener('keyup', (e: any) => {
      if (e.keycode === 13) {
        this.handlesubmit(e);
      }
    });
    this.container = this.elementref.nativeElement.querySelector('#container');
  }
  // function to get title for the question and answer for the first time
  generateTitle(message: any): Promise<any> {
    const apiUrl = 'https://manoharvellala.pythonanywhere.com/generateTitle';
    const requestBody = {
      question: message,
    };

    return fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        const { question, title } = data;

        return title;
      })
      .catch((error) => {
        console.error('Error generating title:', error);
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
  getUserInfo() {
    this.auth.user$.subscribe((user) => {
      this.loggedInUser = user;
    });
  }

  handlesubmit = async (e: any) => {
    e.preventDefault();
    this.loadSection = false;
    this.getUserInfo();

    if (this.titleExist === false) {
      const data = new FormData(this.form ?? undefined);

      await this.generateTitle(data.get('prompt')).then((title) => {
        this.navBarTitle = title;
      });
      this.titleExist = true;
    }

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

    // fetch the data from serve
    console.log(this.loggedInUser.name);
    const response = await fetch(
      'https://manoharvellala.pythonanywhere.com/chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: data.get('prompt'),
          username: `${this.loggedInUser.name}`, // get the username here
          title: `${this.navBarTitle}`,
        }),
      }
    );

    this.reloadNavbar = false;
    this.cdr.detectChanges();
    this.reloadNavbar = true;

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
    this.form.reset();
  };
}
