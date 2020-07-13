import * as React from "react";
import Mermaid from "react-mermaid2";

interface ERDConfig {
  vscode: any;
}

export default class ERD extends React.Component<ERDConfig> {
  constructor(props: any) {
    super(props);
  }

  private erd = `erDiagram
  language ||..|{ film : "a"
  city ||..|{ address : "a"
  country ||..|{ city : "a"
  address ||..|{ customer : "a"
  film ||..|{ filmactor : "a"
  actor ||..|{ filmactor : "a"
  film ||..|{ filmcategory : "a"
  category ||..|{ filmcategory : "a"
  film ||..|{ inventory : "a"
  staff ||..|{ rental : "a"
  inventory ||..|{ rental : "a"
  customer ||..|{ rental : "a"
  address ||..|{ staff : "a"
  staff ||..|{ store : "a"
  address ||..|{ store : "a"
  staff ||..|{ payment : "a"
  rental ||..|{ payment : "a"
  customer ||..|{ payment : "a"`;

  load(element: string): void {
    this.erd = `erDiagram
    language ||..|{ film : "a"
    city ||..|{ address : "a"
    country ||..|{ city : "a"
    address ||..|{ customer : "a"
    film ||..|{ filmactor : "a"
    actor ||..|{ filmactor : "a"
    film ||..|{ filmcategory : "a"
    category ||..|{ filmcategory : "a"
    film ||..|{ inventory : "a"
    staff ||..|{ rental : "a"
    inventory ||..|{ rental : "a"
    customer ||..|{ rental : "a"
    address ||..|{ staff : "a"
    staff ||..|{ store : "a"
    address ||..|{ store : "a"
    staff ||..|{ payment : "a"
    rental ||..|{ payment : "a"
    customer ||..|{ payment : "a"`;
    this.forceUpdate();
    
  }
    
  render() {
    return (
        <div>
          <div className="dropdown">
            <button className="dropbtn">Roots</button>
            <button className="dropbtn2">Roots</button>
            <ol className="dropdown-content">
              <button onClick={()=>this.load('full')}>Full ERD</button>
            </ol>
          </div>
            <Mermaid chart={this.erd} config={{securityLevel: "loose"}}/>
        </div>
    );
  }
}