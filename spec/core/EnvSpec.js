describe('ENV', () => {
  let env

  beforeEach(() => {
    env = new jasmineUnderTest.Env()
  })

  describe('#pending', () => {
    it('throws the Pending Spec exception', () => {
      expect(() => {
        env.pending()
      }).toThrow(jasmineUnderTest.Spec.pendingSpecExceptionMessage)
    })
  })

})
