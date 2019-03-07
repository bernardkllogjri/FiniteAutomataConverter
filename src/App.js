import React, { Component } from "react"
import sortBy from "lodash/sortBy"
import intersection from "lodash/intersection"

import { toAFD, toAFJD } from "./helpers"

export default class extends Component {

  constructor(props) {
    super(props);

    this.state = {
      AFJD: {
        A: { B: ["0"] },
        B: { B: ["1"], C: ["ɛ"] },
        C: { C: ["0"], D: ["1"] },
        D: { }
      },
      finalState: ["D"],
      isAFJD: true,
    };

    this.shuffle = this.shuffle.bind(this);

  }

  shuffle(type){
    const result = type === "AFJD" ? toAFJD(this.state.AFJD, this.state.finalState[0]) : toAFD(this.state.AFJD);

    if(type === "AFJD"){
      const { automat, additionalFinalStates } = result;
      console.log(automat, additionalFinalStates);

      this.setState({
        AFJD: automat,
        finalState: [ ...additionalFinalStates, ...this.state.finalState ],
        isAFJD: !this.state.isAFJD
      });
    }else{
      this.setState({
        AFD: result,
      });
    }

  }

  _render(AFJD, automat, gjendje, gjendjeBir){
    return !AFJD ? (

        <React.Fragment>
          <span>{gjendjeBir}</span>{' -> '}<span style={{
          color: intersection(automat[gjendje][gjendjeBir],this.state.finalState).length ? 'red':'black'
        }}>{sortBy(automat[gjendje][gjendjeBir]).join(", ") || "e"}</span>
        </React.Fragment>

    ) : (

        <React.Fragment>
          <span>{automat[gjendje][gjendjeBir].join(", ")}</span>{' -> '}<span style={{
          color: intersection(gjendjeBir.split(","),this.state.finalState).length ? 'red':'black'
        }}>{gjendjeBir}</span>
        </React.Fragment>

    )
  }

  render(){

    let { AFD, AFJD, isAFJD} = this.state;
    let automat = AFJD;
    if(!isAFJD && !!AFD){
      automat = AFD
    }
    console.log(this.state);

    return (
        <div id='graph' style={{ width: '100%', height: '100%' }}>
          <div style={{ width: "100%", height: "100%" }}>
            {Object.keys(automat).map((gjendje, i) => (

                <div key={i.toString()}>
                  <p>{gjendje}</p>
                  {Object.keys(automat[gjendje]).map((gjendjeBir,j) => (

                      <div key={j.toString()}>
                        {this._render(this.state.isAFJD, automat, gjendje, gjendjeBir)}
                      </div>

                  ))}
                </div>

            ))}
            { isAFJD ? (
                <button onClick={() => this.shuffle("AFJD")}>To AFJD</button>
            ): (!AFD && (<button onClick={() => this.shuffle("AFD")}>To AFD</button>))}
          </div>
        </div>
    );
  }

}