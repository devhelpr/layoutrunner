import React from 'react';
//import { connect } from 'react-redux';

//import { getFlowEventRunner } from '@devhelpr/flowrunner-redux';

//import { config } from '../Config';
import { IRootLayout } from './interfaces';
/*
const config = {

};
*/

export interface FormProps {
  formDefinition: any[];
  layoutBlock: any;
  hasParentForm: boolean;
  parentForm?: FormComponent;
  caption: string;

  formHeader: any;
  formBody: any;

  datasourceNode?: string;
  rootLayout: IRootLayout;

  renderFormControl?: (
    form: FormComponent | undefined,
    formField: any,
    getFormFieldValue: any,
    setFormFieldValue: any,
    getFormValues: any,
    getFlowValue: any,
    setFlowValue: any,
    renderLayoutType: (
      layoutBlock: any,
      isInForm: boolean,
      parentForm: FormComponent | undefined,
      setLayoutVisibleState: (
        layoutBlockName: string,
        isVisible: boolean
      ) => void,
      rootLayout: IRootLayout
    ) => any,
    rootLayout: IRootLayout,
    setLayoutVisibleState: any
  ) => any;

  renderLayoutType: (
    layoutBlock: any,
    isInForm: boolean,
    parentForm: FormComponent | undefined,
    setLayoutVisibleState: any,
    rootLayout: IRootLayout
  ) => any;

  setLayoutVisibleState: any;
}

export interface FormState {
  isInitialised: boolean;
}

/*
const mapStateToProps = (state : any, ownProps : any) => {
	let mappedState : any = {};
	if (ownProps.formDefinition) {
		ownProps.formDefinition.map((formField : any) => {
			if (formField.getVariable) {
				if (!mappedState["_" + formField.getVariable]) {
					mappedState["_" + formField.getVariable] = state[formField.getVariable];
				}
			}
			if (formField.getVariables) {
				formField.getVariables.map((getVariable : any) => {
					if (!mappedState["_" + getVariable]) {
						mappedState["_" + getVariable] = state[getVariable];
					}
				})
			}
		});
	}
	return mappedState;
}

*/

export class FormComponent extends React.Component<FormProps, FormState> {
  state = {
    isInitialised: false,
  };

  getAdditionalStateFields(layoutBlock: any): string[] {
    let result: any[] = [];
    if (layoutBlock.form) {
      layoutBlock.form.map((formField: any) => {
        if (formField.layout) {
          if (formField.type === 'layout') {
            result = result.concat(
              this.getAdditionalStateFields(formField.layout)
            );
          } else {
            formField.layout.map((layoutBlock: any) => {
              result = result.concat(
                this.getAdditionalStateFields(layoutBlock)
              );
              return true;
            });
          }
        } else {
          if (formField.fieldName) {
            result.push(formField.fieldName);
          }
        }
        return true;
      });
    } else if (layoutBlock.layout) {
      if (layoutBlock.type === 'layout') {
        result = result.concat(
          this.getAdditionalStateFields(layoutBlock.layout)
        );
      } else {
        layoutBlock.layout.map((layoutBlock: any) => {
          result = result.concat(this.getAdditionalStateFields(layoutBlock));
          return true;
        });
      }
    }
    return result;
  }

  componentDidMount() {
    if (!this.props.hasParentForm) {
      let initialState: any = {};
      if (this.props.formDefinition) {
        this.props.formDefinition.map((formField: any) => {
          if (formField.fieldName) {
            initialState[formField.fieldName] = '';
          }
          return true;
        });

        const formFieldNames = this.getAdditionalStateFields(
          this.props.layoutBlock
        );
        formFieldNames.map(formFieldName => {
          if (formFieldName) {
            initialState[formFieldName] = '';
          }
          return true;
        });
      }

      const component = this.props.parentForm ? this.props.parentForm : this;

      component.setState({ ...initialState }, () => {
        if (this.props.datasourceNode) {
          //console.log("this.props.rootLayout", this.props.rootLayout);
          /*
					getFlowEventRunner().executeNode(this.props.datasourceNode, {
						...config,
						...this.props.rootLayout.context
						}).then((data : any) => {
							component.setState({
								...data.data, 
								isInitialised : true
							});
						}
					);
					*/
        } else {
          this.setState({ isInitialised: true });
        }
      });
    } else {
      this.setState({ isInitialised: true });
    }
  }

  getFormFieldValue = (fieldName: string) => {
    const component: any = this.props.parentForm ? this.props.parentForm : this;
    return component.state[fieldName] || '';
  };

  setFormFieldValue = (fieldName: string, value: any) => {
    const component = this.props.parentForm ? this.props.parentForm : this;
    return new Promise(resolve => {
      component.setState({ [fieldName]: value } as any, () => {
        resolve();
      });
    });
  };

  getFormValues = () => {
    const component = this.props.parentForm ? this.props.parentForm : this;
    return component.state;
  };

  getFlowValue = (fieldName: string) => {
    const value: any = (this.props as any)['_' + fieldName] as any;
    if (value === undefined) {
      return '';
    }
    return value;
  };

  // todo : rename naar executeNode of iets dergelijks
  setFlowValue = (nodeName: string, value: any) => {
    console.log(nodeName, value);
    //return getFlowEventRunner().executeNode(nodeName, {value : value, ...config});
    return false;
  };

  render() {
    if (!this.state.isInitialised) {
      return <></>;
    }
    const FormHeader = this.props.formHeader;
    const FormBody = this.props.formBody;
    return (
      <>
        <FormHeader
          hasParentForm={this.props.hasParentForm}
          caption={this.props.caption}
        ></FormHeader>
        <FormBody {...this.state} hasParentForm={this.props.hasParentForm}>
          {this.props.formDefinition &&
            this.props.formDefinition.map((formField: any, index) => {
              if (formField.fieldName) {
                //console.log(formField.fieldName + ":state:", this.getFormFieldValue(formField.fieldName));
              }
              return (
                <React.Fragment key={index}>
                  {this.props.renderFormControl &&
                    this.props.renderFormControl(
                      this.props.hasParentForm ? this.props.parentForm : this,
                      formField,
                      this.getFormFieldValue,
                      this.setFormFieldValue,
                      this.getFormValues,
                      this.getFlowValue,
                      this.setFlowValue,
                      this.props.renderLayoutType,
                      this.props.rootLayout,
                      this.props.setLayoutVisibleState
                    )}
                </React.Fragment>
              );
            })}
        </FormBody>
      </>
    );
  }
}

//export const Form = connect(mapStateToProps)(FormComponent);
export const Form = FormComponent;
