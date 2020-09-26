import React from 'react';
import { IElements } from './interfaces';
//import { connect } from 'react-redux';
//import { getFlowEventRunner } from '@devhelpr/flowrunner-redux';

export interface ElementProps extends IElements {
	elementHeader : any;
	elementBody : any;
}

export interface ElementState {

}

/*
const mapStateToProps = (state : any, ownProps : any) => {
	let mappedState : any = {};
	if (ownProps.elements) {
		ownProps.elements.map((element : any) => {
			if (element.getVariable) {
				mappedState["_" + element.getVariable] = state[element.getVariable];
			}
		});
	}
	return mappedState;
}
*/

export class InternalElements extends React.Component<ElementProps, ElementState> {

	state = {

	};

	componentDidMount() {
	}

	getFlowValue = (fieldName : string) => {
		const value : any = (this.props as any)["_" + fieldName];
		if (value === undefined) {
			return "";
		}
		return value;
	}

	render() {
		const ElementHeader = this.props.elementHeader;
		const ElementBody = this.props.elementBody;

		return <>
			<ElementHeader caption={this.props.caption} />
			<ElementBody>{this.props.elements && 
				this.props.elements.map((element : any, index) => {
					const control = this.props.renderElementType(element, this.getFlowValue, this.props.rootLayout);
					return <React.Fragment key={index}>
							{control}
						</React.Fragment>;					
				})}
			</ElementBody>
		</>;
	}
}

//export const Elements = connect(mapStateToProps)(InternalElements);
export const Elements = InternalElements;