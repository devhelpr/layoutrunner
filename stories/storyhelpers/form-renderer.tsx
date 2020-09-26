
import React from 'react';

import { FormComponent, IRootLayout } from '../../src';

export const formHeader = (props: any) => <>
	{props.caption && <h2>{props.caption}</h2>}
</>;

export const formBody = (props : any) => {
	if (!!props.hasParentForm) {
		return <div className="form">{props.children}</div>
	}
	return <form className="form">{props.children}</form>

};

export const renderFormType = (
	form : FormComponent | undefined,
	formField : any, 
	getFormFieldValue : any, 
	setFormFieldValue, 
	getFormValues : any,
	getFlowValue : any,
	setFlowValue : any,
	renderLayoutType : (
		layoutBlock : any, 
		isInForm: boolean, 
		parentForm : FormComponent | undefined,
		setLayoutVisibleState : (layoutBlockName : string, isVisible : boolean) => void, 
		rootLayout: any) => any,
	rootLayout: IRootLayout,
	setLayoutVisibleState: any
) => {
	let showLabel : boolean = true;
	
	const Fields = (fieldName: string) => {
		return getFormFieldValue(fieldName);
	}

	const isVisible = (visibilityExpression: string) => {
		try {
			let expression = new Function('Fields', `return ${visibilityExpression};`);
			let result = expression(Fields);
			return result;
		} catch(err) {
			return true;
		}
	}

	if (!formField.visibility || isVisible(formField.visibility)) {
	
		let includeInFormGroup : boolean = true;
		const renderFormControl = () => {					
			let props : any = {
				rootLayout : rootLayout
			};

			if (formField.showLabel === false) {
				showLabel = false;
			}
			
			let control : any = <input className="form-control" type="text" />;
			const formFieldType = formField.type.toLowerCase();
			if (formFieldType == "checkbox") {
				return <div>
					{formField.options.map((option, index) => {
						return <React.Fragment key={index}>
							<input
								className="mr-2"
								type="checkbox" 
								key={"option" + index} 
								id={formField.fieldName + "-" + option.value}
								title={option.label}
								checked={option.value == getFormFieldValue(formField.fieldName)}
								onChange={() => {
										setFormFieldValue(formField.fieldName, option.value);
										if (formField.node) {
											/*getFlowEventRunner().executeNode(formField.node,
												{	
													...config,
													...getFormValues(), 
													[formField.fieldName] : option.value
												}
											).catch((error) => {
												console.log("error after executeNode in checkbox.onPress", error);
											});
											*/
										}
									}
								}
							></input>
							<label 
								htmlFor={formField.fieldName + "-" + option.value}
								className="mr-3"
							>{option.label}</label>
						</React.Fragment>;
					})}
				</div>;
			} else
			if (formFieldType == "layout") {
				includeInFormGroup = false;
				return <>{renderLayoutType(formField.layout , true, form, setLayoutVisibleState, rootLayout)}</>;			
			} else	
			if (formFieldType == "read") {
				let flowValue = getFlowValue(formField.getVariable);
				if (isNaN(flowValue)) {
					flowValue = "";
				}
				return <div>{flowValue}</div>;			
			} else				
			if (formFieldType == "flowbutton" || formFieldType == "submit") {
				showLabel = false;
				props.onClick = () => {
					console.log("test onpress", formField.node, getFormValues());
					/*getFlowEventRunner().executeNode(formField.node, {
						...config,
						...getFormValues(),
						...rootLayout.context
					}).then((result) => {
						console.log("result", result, rootLayout.name);
						if (formField.closeDetail) {
							//Navigation.goBack(rootLayout.name);
							Navigation.goBack("pageObservable");
						}
					})
					*/
				};
				let newProps = {...props};
				delete newProps.rootLayout;
				control = <input className="btn btn-secondary" type="button" {...newProps} value={formField.fieldName} />;
			} else {
				/*const FormControl = getControl(formFieldType);
				if (FormControl) {
					return <FormControl
						key={formField.fieldName + 
							(formField.getVariable ? "-" + getFlowValue(formField.getVariable) : "")}
						formField={formField}
						setVariable={formField.setVariable}
						node={formField.node}
						setFlowValue={setFlowValue}
						getFlowValue={getFlowValue} 
						datasourceNode={formField.datasourceNode}
						
						getFormFieldValue={getFormFieldValue}
						setFormFieldValue={setFormFieldValue}
						getFormValues={getFormValues}
						rootLayout={rootLayout}
					></FormControl>;	
				}
				*/
			}
			return <React.Fragment>{control}</React.Fragment>;

			/*
			return <Control 
				value={getFormFieldValue(formField.fieldName)} 
				title={formField.fieldName} {...props}></Control>
				*/
		}

		let control = renderFormControl();
		if (includeInFormGroup) {
			return <div className="form-group">
				{showLabel === true && <div>
					<label>{formField.label || formField.fieldName}</label>
				</div>}
				{control}
			</div>;
		} else {
			return <>{control}</>
		}
	}
	return <></>;
}