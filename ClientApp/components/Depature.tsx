import * as React from "react";

export const Depature = (props: any) => {

  return (
    <div>
      <ul>
        <li>{props.name}</li>
        <li>{props.direction}</li>
        <li>{props.time}</li>
      </ul>
    </div>
  );
};
