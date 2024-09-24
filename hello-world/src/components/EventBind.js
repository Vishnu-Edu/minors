import React, { Component } from 'react'

export class EventBind extends Component {
     constructor(props) {
       super(props)
     
       this.state = {
          message:"Hello"
       }
     }
     
  render() {
    return (
         <div>
              <div>{this.state.message}</div>
        <button>Subscribe</button>
      </div>
    )
  }
}

export default EventBind
