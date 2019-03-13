import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import * as serviceWorker from "./serviceWorker"

ReactDOM.render(<App
    AFJD={{
        A: { A: ["0"], B: ["ɛ"] },
        B: { B: ["1"], C: ["ɛ"] },
        C: { C: ["0","1"] }
    }}
    S={"A"}
    F={["C"]}
/>, document.getElementById("root"));

serviceWorker.unregister();