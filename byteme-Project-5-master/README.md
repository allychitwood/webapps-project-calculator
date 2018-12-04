# Project 5
### JavaScript Calculator

### Roles
* Overall Project Manager: Nathan Simpson
* Coding Manager: Will Greenway
* Testing Manager: Carter Brown
* Documentation: Daniel Greer

### Contributions
Please list who did what for each part of the project.
Also list if people worked together (pair programmed) on a particular section.

Carter Brown
  - Implemented memory buttons
  - Added helper functions
    - updateInput()
    - checkInput()
  - Helped Nathan with DEG/RAD button

Will Greenway
  - Implemented "quickOperation" functionality
  - Implemented Ans button
  - Helped Dan and Ally with performOperation()

Daniel Greer
  - Implemented all adding of eventListeners
  - Implemented getInput(), setOperator(), and performOperation()
  - Created base template for calc.html
  - Helped Ally with all object implementation
  
Ally Chitwood
  - Implemented Output object prototyping with Dan
  - Implemented DEL button
  - Elevated CSS
  - Implemented setID function to change a document node by ID
  
Nathan Simpson
  - implemented trig functions
  - Implemented DEG/RAD button to change calculator mode
  - Implemented miscellaneous functions
  - Added buttons/ functionality to html file
  
  
### Testing
The functionality was tested through exploratory testing

### Functions
* Memory Functions:
  - Enter a number and press MS to set the memory variable to the number you entered.
  - Press M+ to add the current input number to the number in memory
  - Press M- to subtract the current input numbner to the number in memory
  - Press MR to recall the number in memory to the screen
  - Press MC to clear the memory
  
* Trig Functions:
  - Trig functions are applied to the current number on button press
  - DEG/RAD Mode: The mode on the button is the current mode. Mode switched on button press
  
* Power Function (^):
  - Input sequence: x ^ y =
    - Computes x to the power of y

* Ans Function:
  - The most recent output is automatically stored in Ans
  - This value is recalled when Ans is pressed
