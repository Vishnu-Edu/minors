// import React, {Component} from 'react';
// class Message extends Component{
//      constructor() {
//           super()
//           this.state = {
//                message:'Welcome visitor'
//           }
//      }
//      changeMessage() {
//           this.setState({
//               message:'Thank you for Subscribing'
//            })
//       }
//      render() {
//           return (
//                <div>
//                     <h1>{this.state.message}</h1>
//                     <button onClick={()=>this.changeMessage()}>Subscribe</button>
//                </div>
//           )
//      }
// }
// export default Message;

// import { messageTypes } from 'node-telegram-bot-api/src/telegram'
import React, { Component } from 'react'
class Message extends Component{


     constructor() {
          super()
          this.state={
               message:"Welcome Visitor"    
          }
     }
     changeMessage() {
          this.setState({
                message:"Thank You For Subscribing!"
           })
      }



     render() {
          return (
               <div>
                    <h1>{this.state.message}</h1>
                    <button onClick={()=>this.changeMessage()}>Subscribe</button>
               </div>
          )
     }
}
export default Message