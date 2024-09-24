// import React, { Component } from 'react'

// const Hello = () => {
//      // return(
//      //      <div className="dummyClass">
//      //           <h1>Hello Prabhas</h1>
//      //      </div>

//      // )
//      // return React.createElement('div', {id:'hello',className:'dummyClass'}, React.createElement('h1',null,'Hello prabhas'));
// }
// export default Hello;
// import React from 'react'
// const Hello = ()=>{
//      return React.createElement(
//           'div',
//           {id:"hello",className:"dummy Class"},
//           React.createElement('h1', null, "Hello World!"));
// }
// export default Hello;

// import React from 'react'
// const Hello = () => {
//      return (
//           <div>
//                <h1>Hello Prabhas</h1>
//           </div>
//      )
// }

import React from 'react'
const Hello = () => {
     return React.createElement('div',
          null,
          React.createElement('h1', null, 'This is the basic Website Using React'))
}
export default Hello;