import React from 'react';
import { connect } from "react-redux";

/*
import { 
	ReactComponentFlowConnector
} from '@devhelpr/flowrunner-redux';
*/

import { FormComponent } from './form';
import { IRootLayout} from './interfaces';

import * as uuid from 'uuid';

const uuidV4 = uuid.v4;


export interface LayoutComponentProps {
	nodeName: string;
	payload: any;
	rootLayout? : IRootLayout;
	isAppShell? : boolean;
	onAppMount? : (payload : any) => void;
	onGetStylesFromPayload? : (payload : any) => any;
	onPageMount? : (payload : any) => void; 
	filterLayout?: (layoutBlock : any) => boolean;
	renderNavigation?: (navigationBlock: any, 
					navigationActions : any[],
					navigationActionVariables: any) => any;
	renderLayoutType: (layoutBlock : any, 
		isInForm : boolean, 
		form : FormComponent | undefined, 		
		setLayoutVisibleState : (layoutBlockName : string, isVisible : boolean) => void,
		rootLayout : IRootLayout
	) => any
}
// setNavigationActions? : (navigationActions: any[]
export interface LayoutComponentState {
	layoutVisibleState : boolean[];
}

const mapStateToProps = (state : any, ownProps : any) => {
	let mappedState : any = {};
	//console.log("ownProps", ownProps);
	if (ownProps.payload && ownProps.payload.navigationActions) {
		//console.log("ownProps.payload.navigationActions", ownProps.payload.navigationActions);
		ownProps.payload.navigationActions.map((navigationAction : any) => {			
			if (navigationAction.getVariable) {
				mappedState["_" + navigationAction.getVariable] = state[navigationAction.getVariable];
			}

			if (navigationAction.visibleByVariable) {
				mappedState["_" + navigationAction.visibleByVariable] = state[navigationAction.visibleByVariable];
			}

			if (navigationAction.enabledByVariable) {
				mappedState["_" + navigationAction.enabledByVariable] = state[navigationAction.enabledByVariable];
			}
		})			
	}
	return mappedState;
}

/*
const mapDispatchToProps = (dispatch: any) => {
	return {
	}
}
*/



// https://medium.com/@jrwebdev/react-higher-order-component-patterns-in-typescript-42278f7590fb

class InternalLayoutComponent extends React.Component<LayoutComponentProps, LayoutComponentState> {
	
	isAppMounted = false;
	
	state = {
		layoutVisibleState : []
	}

	setLayoutVisibleState = (layoutBlockName : any, isVisible : boolean) => {

		// TODO :
		//  - add promise
		//  - remove renderTrigger ??
		if (Array.isArray(layoutBlockName)) {
			let layoutVisibleState : any = {};
			layoutBlockName.map((layoutBlock) => {
				let orgIsVisible = true;
				const isVisible = !!layoutBlock.isVisible;
				if (this.state.layoutVisibleState[layoutBlock.name] !== undefined) {
					orgIsVisible = !!this.state.layoutVisibleState[layoutBlock.name];
				}
				if (isVisible !== orgIsVisible) {
					layoutVisibleState[layoutBlock.name]=  !!isVisible;
				}
			});

			this.setState({
				layoutVisibleState: {
					...this.state.layoutVisibleState,
					...layoutVisibleState
				}
			}, () => {
				console.log("LayoutVisibleState after setstate", this.state.layoutVisibleState);
			});
		} else {
			let orgIsVisible = true;
			if (this.state.layoutVisibleState[layoutBlockName] !== undefined) {
				orgIsVisible = !!this.state.layoutVisibleState[layoutBlockName];
			}
			console.log(layoutBlockName, isVisible,orgIsVisible, this.state.layoutVisibleState[layoutBlockName], this.state.layoutVisibleState);
			if (isVisible !== orgIsVisible) {
				console.log("layoutBlockName", layoutBlockName ,isVisible);
				this.setState({
					layoutVisibleState: {
					...this.state.layoutVisibleState,
					[layoutBlockName]: !!isVisible}
				}, () => {
					console.log("LayoutVisibleState after setstate", this.state.layoutVisibleState);
				});
			}
		}
	}

	localStore : any = {}

	getValueFromLocalStore = (key : string) => {
		return this.localStore[key];
	}

	setValueFromLocalStore = (key : string, value : any) => {
		this.localStore[key] = value;
	}

	render() {
		if (!this.props.payload || !this.props.payload.layout) {
			return <></>;
		}

		if (!this.isAppMounted && !!this.props.isAppShell && this.props.onAppMount) {
			this.isAppMounted = true;
			this.props.onAppMount(this.props.payload)
		}

		const layout : any[] = this.props.payload.layout;
		const navigationActionVariables : any = {};
		if (this.props.payload && this.props.payload.navigationActions) {
			this.props.payload.navigationActions.map((navigationAction : any) => {			
				if (navigationAction.getVariable) {
					navigationActionVariables[ navigationAction.getVariable] = (this.props as any)["_" + navigationAction.getVariable];
				}
				if (navigationAction.visibleByVariable) {
					navigationActionVariables[ navigationAction.visibleByVariable] = (this.props as any)["_" + navigationAction.visibleByVariable];
				}
				if (navigationAction.enabledByVariable) {
					navigationActionVariables[navigationAction.enabledByVariable] = (this.props as any)["_" + navigationAction.enabledByVariable];
				}
			})			
		}

		let styles = {};
		if (this.props.payload && this.props.onGetStylesFromPayload) {
			styles = this.props.onGetStylesFromPayload(this.props.payload)
		}

		return <React.Fragment key={uuidV4()}>
			{this.props.renderNavigation && this.props.renderNavigation(this.props.payload.navigation, this.props.payload.navigationActions || [], navigationActionVariables)}
			{
				layout.map((layoutBlock : any, index : number) => {
					
					if (this.props.filterLayout && !this.props.filterLayout(layoutBlock)) {					
						return <React.Fragment key={"layoutblock-" + index}></React.Fragment>;
					}					

					/*
						todo:
							- passthrough setLayoutVisibleState method
							- if layoutBlock has a name and this exists in state.layoutVisibleState
								.. and this is false.. then HIDE the layoutBlock
								.. otherwise : show the layoutBlock 
							
							- howto handle initialstate?
								- optional property visible

					*/

					if (layoutBlock.name && this.state.layoutVisibleState[layoutBlock.name] !== undefined && 
						this.state.layoutVisibleState[layoutBlock.name] === false) {
						return <React.Fragment key={"layoutblock-" + index}></React.Fragment>;
					}
					return <React.Fragment key={"layoutblock-" + index}>
							{this.props.renderLayoutType(layoutBlock, false, undefined, this.setLayoutVisibleState, this.props.rootLayout ? this.props.rootLayout : {
								name: this.props.nodeName, 
								layout: layout,
								context: this.props.payload.context || {},
								styles: styles,
								getValueFromLocalStore : this.getValueFromLocalStore,
								setValueFromLocalStore : this.setValueFromLocalStore,
							})}
					</React.Fragment>
				})
			}
		</React.Fragment>;
	}
}

//export const Layout = ReactComponentFlowConnector(connect(mapStateToProps, mapDispatchToProps)(InternalLayoutComponent));
export const Layout = connect(mapStateToProps)(InternalLayoutComponent);

