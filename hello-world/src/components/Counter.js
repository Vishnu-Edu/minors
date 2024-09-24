// import React, { Component } from 'react';
// class Counter extends Component{
//      constructor(props) {
//           super(props)
//           this.state = {
//                count:0
//           }
//      }
//      increment() {
//           this.setState({
//                count:this.state.count += 1
//           }, () => {
//                console.log("Call back functon =",this.state.count)
//           })
//           console.log(this.state.count)
//      }
//      render() {
//           return (
//                <div>
//                     <div>Count - {this.state.count}</div>
//                     <button onClick={()=>this.increment()}>increment</button>
//                </div>
//           )
//      }
// }

// export default Counter;
import React, { Component } from 'react'

class Counter extends Component {
     constructor(props) {
       super(props)
     
       this.state = {
            count: 0
          }
     
     }
     increament() {
          // this.setState({
          //      count: this.state.count + 1
          // }, () => {
          //      console.log("Callback value",this.state.count)
          // })
          // console.log("Counter value",this.state.count)
          this.setState(prevState => ({
              count: prevState.count + 1
          }))
          console.log(this.state.count)
     }
     increamentFive() {
          this.increament()
          this.increament()
          this.increament()
          this.increament()
          this.increament()
     }
     
  render() {
    return (
         <div>
              <div>Count-{this.state.count}</div>
        <button onClick={()=>this.increamentFive()}>Increament</button>
      </div>
    )
  }
}

export default Counter
