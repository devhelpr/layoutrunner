import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux'


function dummyApp(state) {  
  return state
}

const store = createStore(dummyApp);

import { 
  FormComponent, 
  Layout, 
  Elements, 
  LayoutComponentProps, 
  IRootLayout 
} from '../src';

const meta: Meta = {
  title: 'Layout',
  component: Layout,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

let payload = {
  layout : [
    {
      type: "element"
    }
  ]
};

const renderLayoutType = (layoutBlock : any, 
    isInForm : boolean, 
    form : FormComponent | undefined, 		
    setLayoutVisibleState : (layoutBlockName : string, isVisible : boolean) => void,
    rootLayout : IRootLayout
  ) => {
    if (layoutBlock.type === "element") {
      return <div>Element</div>
    }
    return <></>;
}

const Template: Story<LayoutComponentProps> = args => <Provider store={store}>
    <Layout 
      renderLayoutType={renderLayoutType}
      payload={payload} {...args} />
  </Provider>;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
