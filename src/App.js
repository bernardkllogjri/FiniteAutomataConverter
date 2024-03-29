import sortBy from "lodash/sortBy"
import Graph from "react-graph-vis"
import React, { Component } from "react"
import intersection from "lodash/intersection"
import {toAFD, toAFJD, afdGraph, kalimet} from "./helpers"


export default class extends Component {

  constructor(props) {
    super(props);

    this.state = {
      AFJD: {},
      AFD: undefined,
      finalState: this.props.F,
      startingState: this.props.S,
      isAFJD: true,
      options :{
        height: '100%',
        width: '100%',
        edges: {
          color: "#000000"
        }
      },
    };

    this.shuffle = this.shuffle.bind(this);

  }


  buildGraph(){

    const nodes = Object.keys(this.state.AFJD).reduce((acc, state, index) => [...acc, {
      id: index,
      label: state,
      borderWidth: (this.state.finalState.includes(state) ? 5 : 1),
      color: state === this.state.startingState ? { background: '#2779f0' } : null
    }],[]);
    return {
      nodes,
      edges: nodes.reduce((acc,node) => [
        ...acc,
        ...Object.keys(this.state.AFJD[node.label])
            .reduce(
                (acc,state) => [
                  ...acc, {
                    from: node.id,
                    to: nodes.find(current => current.label === state).id,
                    label: this.state.AFJD[node.label][state].join(","),
                  }
                ],[])],[])
    }
  }

  componentDidMount() {
    this.setState({
      AFJD: this.props.AFJD
    },() => {
      this.setState({
        graph: this.buildGraph()
      })
    });
  }

  shuffle(type){
    const transitions = kalimet(this.state.AFJD);
    const result = type === "AFJD" ? toAFJD(this.state.AFJD, this.state.finalState[0]) : toAFD(this.state.AFJD);

    if(type === "AFJD"){

      const { automat, additionalFinalStates } = result;
      console.log({ automat });
      this.setState({
        AFJD: automat,
        finalState: [ ...additionalFinalStates, ...this.state.finalState ],
        isAFJD: !this.state.isAFJD,
      },() => {
        this.setState({
          graph: this.buildGraph()
        })
      });

    }else{

      this.setState({
        AFD: result,
        graph: afdGraph(result, this.state.finalState,transitions)
      });

    }

  }

  _render(automat){
    return Object.keys(automat).map((gjendje, i) => (

        <div key={i.toString()}>
          <p>{gjendje}</p>
          {Object.keys(automat[gjendje]).map((gjendjeBir,j) => (

              <div key={j.toString()}>
                {this.state.AFD ? (

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

                )}
              </div>

          ))}
        </div>
    ))
  }

  render(){
    let {
      AFD,
      isAFJD,
      graph,
      options,
      events,
    } = this.state;

    return (
        <div id='graph' style={{ width: '100%', height: '100%' }}>
          { isAFJD ? (
              <button onClick={() => this.shuffle("AFJD")}>To AFJD</button>
          ): (!AFD && (<button onClick={() => this.shuffle("AFD")}>To AFD</button>))}

          {graph && (
              <Graph ref={ref => this.graph = ref} graph={graph} options={options} events={events} />
          )}
        </div>
    );
  }

}