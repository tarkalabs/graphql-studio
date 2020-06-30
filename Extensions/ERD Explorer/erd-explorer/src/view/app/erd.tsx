import * as React from "react";
import Mermaid from "react-mermaid2";

interface IConfigProps {
  vscode: any;
}

export default class ERD extends React.Component<IConfigProps> {
  constructor(props: any) {
    super(props);
  }
    
  render() {
    return (
        <Mermaid chart={`
          erDiagram
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
            customer ||..|{ payment : "a"`}/>
    );
  }
}