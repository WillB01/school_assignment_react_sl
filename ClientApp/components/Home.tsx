import * as React from "react";
import {Stations} from './Stations';
import { Container, Segment, Header } from "semantic-ui-react";
import { Depature } from "./Depature";
import  {CheckBox} from './CheckBox';

interface IHomeState {
    text: string;
    stations: any;
    showStations: boolean;
    departures: any;
    savedOriginalStateDepartures: any;
    showDepartures: boolean;
    stopsOnRoute: any;
    showStopsOnRoute: boolean;
    elementId: any;
    transportation: [
        {id: 1, value: "buss", isChecked: false},
        {id: 2, value: "tbana", isChecked: false},
        {id: 3, value: "pendel", isChecked: false}
      ];
      bussArr: any;
      tbanaArr: any;
      pendelArr: any;
   
}

export class Home extends React.Component<{}, IHomeState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            text: "" ,
            stations: [],
            showStations: false,
            departures: [],
            savedOriginalStateDepartures: [],
            showDepartures: false,
            stopsOnRoute: [],
            showStopsOnRoute: false,
            elementId: '',
            transportation: [
                {id: 1, value: "buss", isChecked: false},
                {id: 2, value: "tbana", isChecked: false},
                {id: 3, value: "pendel", isChecked: false},
              ],
            bussArr: [],
            tbanaArr: [],
            pendelArr: []

            
           
            
        };
    }
    private onTextChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({ text: e.currentTarget.value });
    } // Gets the input value

    private onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.which === 13) {
            let { text  } = this.state;
            this.setState({
                text: text,
            });
            this.fetchStations();     
        }
    } // Get API from enter KEY PRESS

    private onButtonClick = () => {
        let { text  } = this.state;
        this.setState({
            text: text,
        });
        this.fetchStations();                     
    } //Search button

    private fetchStations = () => {
        fetch(`/api/search/${this.state.text}`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                for (const item of data.StopLocation) {
                    if (item.id === '' || !item.name.toLocaleLowerCase().substr(this.state.text.toLocaleLowerCase())) {
                     console.log('error');
                     this.setState({
                         showStations: false
                     });
                    } else {
                        this.setState({
                            stations: data, 
                            showStations: true}
                        );
                    };
                };
              
            })
            .catch((error) => {
                console.log(error);
            });
    } // get stations

    private onClearClick = () => {
        this.setState({
            text: "",
            stations: [],
            showStations: false,
            departures: [],
            showDepartures: false,
            transportation: [
                {id: 1, value: "buss", isChecked: false},
                {id: 2, value: "tbana", isChecked: false},
                {id: 3, value: "pendel", isChecked: false},
              ],
        });
    } // clear everything

    private fetchDepatureData = (id: any) => {
        fetch(`/api/realtime/${id}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            const catCodeforBuss = '7';
            const catCodeforTbana = '5';
            const catCodeforPendel = '4';
            const buss = data.Departure.filter((item: any) => item.Product.catCode === catCodeforBuss);
            const tbana = data.Departure.filter((item: any) => item.Product.catCode === catCodeforTbana);
            const pendel = data.Departure.filter((item: any) => item.Product.catCode === catCodeforPendel);
           
            this.setState({
                departures: data.Departure,
                savedOriginalStateDepartures: data.Departure,
                showDepartures: true,
                bussArr: buss,
                tbanaArr: tbana,
                pendelArr: pendel,
                transportation: [
                    {id: 1, value: "buss", isChecked: false},
                    {id: 2, value: "tbana", isChecked: false},
                    {id: 3, value: "pendel", isChecked: false},
                  ],
            });
            
        })
        .catch((error) => console.log(error));
    } // get the depature time from clicked station

     private handleCheckChieldElement = (event: any) => {
        let transportation = this.state.transportation
        transportation.forEach(vechicle => {
           if (vechicle.value === event.target.value){
            vechicle.isChecked =  event.target.checked
            this.filterDepatrues();

           }
        });
        this.setState({transportation: transportation})
      } // handles the checkboxes for filtering the transportation type.

    private filterDepatrues = () => {
        this.setState({
            departures: this.state.savedOriginalStateDepartures
        }); // resets the filterd back to original

        const transportation = this.state.transportation;
           if (transportation[0].isChecked || transportation[1].isChecked  || transportation[2].isChecked){ // 0: buss - 1: tbaba - 2:pendel    
                const arr = [
                ...(transportation[0].isChecked  ? this.state.bussArr : []),
                ...(transportation[1].isChecked  ? this.state.tbanaArr : []),
                ...(transportation[2].isChecked  ? this.state.pendelArr : [])
                ];
                this.setState({departures: arr});
            
           }; //check if any checkboxes are clicked
           

    } // add the specific transportation to an array and then set a new depature state with the new filtered array
         
    public render(): JSX.Element {
        const { text } = this.state;
        let departureHeader = '';
        let stationsRender = null;
        let depatureRender = null;
        let stopsOnRouteRender: any;
        

        if (this.state.showStations) {
            stationsRender = (
                <div className="stations"> 
                    {this.state.stations.StopLocation.map((item: any, index: any) => {
                       return(
                           <Stations key={item.id}
                                     station={item.name}
                                     id={item.id}
                                     handleStationClick={(id: any) => this.fetchDepatureData(id)} />
                                                              
                       );
                    })}
                </div>
            );
        } // first search result. shows only the stations

        if (this.state.showDepartures) {
            depatureRender = (
                <div>
                    <ul>
                        {
                        this.state.transportation.map((vechicle) => {
                            return (<CheckBox handleCheckChieldElement={this.handleCheckChieldElement}  {...vechicle} />)
                        })
                        }
                    </ul>
                    
                    {this.state.departures.map((item: any, index: any) => {
                        departureHeader = item.stop;
                        return(
                            <div>
                                <Depature key={item.id}
                                      indexId={index}
                                      name={item.name}
                                      stops={item.Stops}
                                      direction={item.direction}
                                      time={item.time}
                                      stop={item.stop} />  
                            </div>    
                                
                        )
                    })
                    }
                </div>
            )
        }

        return <Container>
            <Segment>
                <div className="my-app">
                    <div className="container">
                        <input value={text} onChange={this.onTextChange} onKeyDown={this.onKeyDown} placeholder="search"/>
                        <button onClick={this.onButtonClick} disabled={!(text.trim())}>search</button>
                        <button onClick={this.onClearClick} disabled={!this.state.showStations}>clear</button>
                        {stationsRender}
                        <h5>{departureHeader}</h5>
                        {depatureRender}
                    </div>
                </div>
            </Segment>
        </Container>;
    }
}