import React from 'react';

// todo : use proper type instead of any
export const elementHeader = (props : any) => <></>;


export const elementBody = (props : any) => <>
	{props.children}
</>;


export const renderElementType = (element : any) => {
	let showLabel : boolean = true;

	const renderElement = () => {					
		
		let Control : any = React.Fragment;

		let props : any = {};
		const fieldType = element.type.toLowerCase();

		if (fieldType == "element") {
			Control = (props : any) => {
				return <div>
					<h2>{element.caption}</h2>
				</div>
			}
			showLabel = false;
			props.nodeName = element.node;
		} 

		return <Control 
			title={element.fieldName} {...props}></Control>
	}
	
	let control = renderElement();

	return <>
		{showLabel === true && <span>{element.fieldName}</span>}
		{control}
	</>
}