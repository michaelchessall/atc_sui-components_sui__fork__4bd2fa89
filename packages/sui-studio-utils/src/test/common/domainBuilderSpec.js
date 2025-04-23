/* eslint-env mocha */
import {expect} from 'chai'
import sinon from 'sinon'

import {DomainBuilder} from '../../index.js'

describe('DomainBuilder', () => {
  describe('when a useCase is mocked', () => {
    const domainBuilder = DomainBuilder.extend({domain: {get: () => {}}})
    it('should return the mocked response', async () => {
      const domain = domainBuilder.for({useCase: 'get_products'}).respondWith({success: 'mocked-response'}).build()
      expect(await domain.get('get_products').execute()).to.equal('mocked-response')
    })
  })

  describe('when config is mocked', () => {
    const domainBuilder = DomainBuilder.extend({
      domain: {get: () => {}},
      config: 'mocked-config'
    })
    it('should return the mocked response', async () => {
      const domain = domainBuilder.build()
      expect(await domain.get('config')).to.equal('mocked-config')
    })
  })

  describe('when a useCase is called with parameters', () => {
    it('should call the useCase with the correct parameters', async () => {
      const executeSpy = sinon.spy()

      const domainMock = {
        get: useCase => {
          if (useCase === 'get_products') {
            return {
              execute: executeSpy
            }
          }
          return {}
        }
      }

      const domainBuilder = DomainBuilder.extend({domain: domainMock})
      const domain = domainBuilder
        .for({useCase: 'get_products'})
        .respondWith({success: ['apple', 'orange']})
        .build()

      const params = {category: 'fruits', limit: 10}
      await domain.get('get_products').execute(params)

      expect(executeSpy.calledOnce).to.be.true
      expect(executeSpy.calledWith(params)).to.be.true
    })
  })
})
