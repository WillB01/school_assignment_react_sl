import * as React from "react";

export const Stations = (props: any) => {
   
    return(
        <div>
            <a onClick={() => props.handleStationClick(props.id)} href="#">{props.station}</a>
        </div>
    );
}
