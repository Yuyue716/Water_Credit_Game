import React from 'react'
import { shallow } from 'enzyme'

import Field from '../Field/index.js'
import CowPen from '../CowPen/index.js'
import Shop from '../Shop/index.js'
import { stageFocusType } from '../../../src/enums.js'

import { Stage } from './Stage.js'

let component

beforeEach(() => {
  component = shallow(
    <Stage
      {...{
        field: [[]],
        stageFocus: stageFocusType.FIELD,
        viewTitle: '',
      }}
    />
  )
})

describe('focus', () => {
  describe('field', () => {
    beforeEach(() => {
      component.setProps({ gameState: { stageFocus: stageFocusType.FIELD } })
    })

    test('shows the field', () => {
      expect(component.find(Field)).toHaveLength(1)
    })
  })

  describe('shop', () => {
    beforeEach(() => {
      component.setProps({ stageFocus: stageFocusType.SHOP })
    })

    test('shows the shop', () => {
      expect(component.find(Shop)).toHaveLength(1)
    })
  })

  describe('cow pen', () => {
    beforeEach(() => {
      component.setProps({ stageFocus: stageFocusType.COW_PEN })
    })

    test('shows the cow pen', () => {
      expect(component.find(CowPen)).toHaveLength(1)
    })
  })
})
