import React from 'react'
import { shallow } from 'enzyme'

import ProgressBar from './ProgressBar.js'

let component

beforeEach(() => {
  component = shallow(<ProgressBar {...{ percent: 0 }} />)
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
