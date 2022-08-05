import { Component, Input, OnInit } from '@angular/core';
import {
        initializeComplete,
        NOTIFICATION_TYPE,
        sendNotification,
        setAppHeight,
        queueUpdate,
        registerQueueUpdate,
        queueAction,
        registerQueueAction
      } from '@amc-technology/davinci-api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit{
  // Variable to determine if scroll was clicked
  openQueue = false;
  // Array to store all queue information
  queues = [{name: "1", avaliableAgents: 1, queuedCalls: 10, longestWait: "", serviceLevel: "", avgSpeedAnswer: "", avgHandleTime: "", abandons: "", totalCalls: 26},
            {name: "2", avaliableAgents: 0, queuedCalls: 18, longestWait: "", serviceLevel: "", avgSpeedAnswer: "", avgHandleTime: "", abandons: "", totalCalls: 39},
            {name: "3", avaliableAgents: 0, queuedCalls: 56, longestWait: "", serviceLevel: "", avgSpeedAnswer: "", avgHandleTime: "", abandons: "", totalCalls: 107}
  ];
  // Variable to show active, causes rotation effect
  @Input() activeQueue;
  // Interval to change queue every N seconds
  queueInterval;
  // Track current position in the queue array
  currentQueue = 0;
  // Columns for table
  displayedColumns = ['queueName', 'avaliableAgents', 'queuedCalls'];
  // App height for expansion of the application, grabs config value in Creator Studio application
  appHeight;
  selectedRow;

  async ngOnInit(): Promise<void> {
      // Initializes the app so it can display. returns a promise of the app configurations
      const configs = await initializeComplete();
      // Grab app height config
      this.appHeight = configs.variables.AppHeight;
      // Set app height to the 20px given by top banner position
      setAppHeight(20, false);
      // Test notification to show that notification displays over the application
      sendNotification('Queue alert', NOTIFICATION_TYPE.Information);
      this.isQueue();
      await registerQueueUpdate(
        (queues: any) =>
          new Promise((resolve, reject) => {
            console.log('Queue Update has occurred');
            console.log(queues);
            for(let i = 0; i < this.queues.length; i++) {
              if(this.queues[i].name === queues.name) {
                this.queues[i] = queues;
              }
            }
          })
      );
      await registerQueueAction(
        (queues: any) =>
          new Promise((resolve, reject) => {
            console.log('Queue Action has occurred');
            console.log(queues);
          })
      );
  }

  // Expand the application upon click:
  //    - Application expands to app height set in application config
  expand() {
    setAppHeight(this.appHeight as number, true);
    this.openQueue = true;
  }

  // Collapse the app to only show the queues scrolling
  collapse() {
    setAppHeight(20, false);
    this.openQueue = false;
  }

  // Check for current queues, if not make a default empty queue
  isQueue() {
    if(this.queues.length !== 0) {
      this.activeQueue = this.queues[0];
    } else {
      this.activeQueue = {avaliableAgents: "-", queuedCalls: "-", longestWait: "-", serviceLevel: "-", avgSpeedAnswer: "-", avgHandleTime: "-", abandons: "-", totalCalls: "-"};
    }
    // Start interval for rotating queues
    this.queueInterval = setInterval(this.rotateQueues.bind(this), 10000)
  }

  // Grab the next queue in the array and set it to active
  //  - If the array is of max length, repeat queues from beginning
  rotateQueues() {
    if((this.currentQueue + 1) === this.queues.length) {
      this.currentQueue = 0;
      this.activeQueue = this.queues[this.currentQueue];
    } else {
      this.currentQueue++;
      this.activeQueue = this.queues[this.currentQueue];
    }
  }

  // A function that displays the usage of the API call "queueUpdate"
  // Illustrates passing an object, a queue change in this example
  // Queue 1 is changed from having 26 calls to 27 calls. The change can be seen within the rotation of the queues in the top banner position when collapsed.
  // If queue 1 is being displayed while this function is called, the total Calls value will not change to 27 until the next time Queue 1 is shown.
  updateQueueData() {
    queueUpdate({name: "1", avaliableAgents: 1, queuedCalls: 10, longestWait: "", serviceLevel: "", avgSpeedAnswer: "", avgHandleTime: "", abandons: "", totalCalls: 37});
  }

  clickTableRow(row: any) {
    queueAction(row);
  }

  select(row) {
    this.selectedRow = row;
  }
}
