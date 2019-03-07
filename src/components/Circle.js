import React from "react"

export default props => {
  return (
      <circle cx={props.x} cy={props.y} r={props.r} fill="transparent" stroke="black" stroke-width="3">
          <text x="50%" y="50%" text-anchor="middle" fill="black" font-size="100px" font-family="Arial" dy=".3em">BC</text>
      </circle>
  )
}
