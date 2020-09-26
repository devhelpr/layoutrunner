import React from 'react';
import { Meta, Story } from '@storybook/react';
//import { Provider } from 'react-redux';
//import { createStore } from 'redux'
import { renderLayoutType } from './storyhelpers/layout-renderer';

function dummyApp(state) {  
  return state
}

//const store = createStore(dummyApp);

import { LayoutComponentProps } from '../src/components/layout';

import { 
  FormComponent, 
  Layout, 
  Elements,
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
      type: "elements",
      elements : [
        {
          type: "element",
          caption: "hello"
        }
      ]
    },
    {
      type: "form",
      caption: "form caption",
      form : [
        {
          type: "checkbox",
          fieldName: "checkbox1",
          caption: "hello",
          options: [
            {
              label: "checkbox label",
              value: 1
            },
            {
              label: "checkbox label 2",
              value: 2
            }
          ]
        },
        {
          type: "input",
          fieldName: "input1",
          label: "input label"
        }
      ]
    },
    {
      type: "layout",
      layout : [
        {
          type: "elements",
          elements : [
            {
              type: "element",
              caption: "element1"
            }
          ]
        },
        {
          type: "elements",
          elements : [
            {
              type: "element",
              caption: "element2"
            }
          ]
        },
        {
          type: "form",
          caption: "form caption",
          form : [            
            {
              type: "input",
              fieldName: "input2",
              label: "input label2"
            }
          ]
        },
        {
          type: "layout",
          layout : [
            {
              type: "elements",
              elements : [
                {
                  type: "element",
                  caption: "hello element"
                }
              ]
            }
          ]
        }
      ]
    },
  ]
};


// <Provider store={store}>
const Template: Story<LayoutComponentProps> = args => <Layout 
      renderLayoutType={renderLayoutType}
      payload={payload} {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
