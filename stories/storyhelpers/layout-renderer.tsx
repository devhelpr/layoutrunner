import React from 'react';
import { 
	FormComponent, 
	Form,
	Layout, 
	Elements, 
	IRootLayout 
} from '../../src';
 
import { elementHeader, elementBody, renderElementType } from './element-renderer';
import { formBody, formHeader, renderFormType } from './form-renderer';

export const renderLayoutType = (layoutBlock : any, 
    isInForm : boolean, 
    form : FormComponent | undefined, 		
    setLayoutVisibleState : (layoutBlockName : string, isVisible : boolean) => void,
    rootLayout : IRootLayout
  ) => {
	
	if (layoutBlock.type === "form") {
		return <Form 
			formDefinition={layoutBlock.form}
			parentForm={form}
			hasParentForm={false}
			layoutBlock={layoutBlock}
			formHeader={formHeader}
			formBody={formBody}
			caption={layoutBlock.caption}
			renderFormControl={renderFormType}
			renderLayoutType={renderLayoutType}
			datasourceNode={layoutBlock.datasourceNode}
			rootLayout={rootLayout}
			setLayoutVisibleState={setLayoutVisibleState}
		></Form>
	} else 
    if (layoutBlock.type === "elements") {
		return <Elements
			elementHeader={elementHeader}
			elementBody={elementBody}
			elements={layoutBlock.elements}
			caption={layoutBlock.caption}
			renderElementType={renderElementType}
			rootLayout={rootLayout}	
		></Elements>
    } else 
    if (layoutBlock.type === "layout") {
			if (!layoutBlock.layout) {
				return <></>;
			}
			
			return <>
				{layoutBlock.layout.map((layout, index) => {
					return <React.Fragment key={"layout-" + index}>
						<div style={{marginLeft:"40px"}}>{renderLayoutType(
                  layout,
                  isInForm,
                  form, 
                  setLayoutVisibleState,
                  rootLayout
                )}
            </div>
					</React.Fragment>})}
			</>;

		}
    return <></>;
}