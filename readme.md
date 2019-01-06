# idle-session-timeout

Idle session timeout is a security and resource management feature that automatically logs a user out after a period of inactivity.

## Installation
  
```
npm i idle-session-timeout
```

## Example

```Typescript
import { IdleSessionTimeout } from "idle-session-timeout";

//time out in 5 min on inactivity
let session = new IdleSessionTimeout(5 * 60 * 1000);

session.onTimeOut = () => {
// here you can call your server to log out the user
    console.log("timeOut");
};

//optional
session.onTimeLeftChange = (timeLeft) => {
    // this will notify you  each second about the time left before the timeout
    console.log(`${timeLeft} ms left`);
};

session.start();
 
// can be manually reset.
session.reset();
// Note:when the session is expired, it's automatically disposed. 
// To reset the counter for expired session use start method.

// to dispose the session
session.dispose();

// returns time left before time out
let timeLeft = session.getTimeLeft();
```

By default the counter is automatically reset on those events:

* page load
* mouse move
* mouse down
* mouse up
* key press
* DOM Mouse Scroll
* mouse wheel
* MS Pointer Move
* click
* scroll
* touch start
* touch move
* touch end

if for some reason you want to chose the events for the reset you can use

```Typescript

import { IdleSessionTimeout } from "idle-session-timeout";

//time out in 5 min on inactivity
let session = new IdleSessionTimeout(5 * 60 * 1000, "click", "mousemove", ... etc );

```