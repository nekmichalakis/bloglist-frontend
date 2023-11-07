describe('Blog app', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Testi Testi',
      username: 'tester',
      password: 'tester'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:5173/')
  })

  it('Login form is shown', () => {
    cy.contains('log in')
    cy.contains('username')
  })

  describe('Login', () => {
    describe('with correct credentials', () => {
      beforeEach(() => {
        cy.get('#username').type('tester')
        cy.get('#password').type('tester')
        cy.get('#login-button').click()
      })

      it('succeeds', () => {
        cy.contains('tester logged in')
      })

      describe('a blog', () => {
        beforeEach(() => {
          cy.contains('create new blog').click()
          cy.get('#title-input').type('test title')
          cy.get('#author-input').type('test author')
          cy.get('#url-input').type('test url')
          cy.get('#create-button').click()
        })

        it('can be created', () => {
          cy.contains('test title test author')
        })

        describe('', () => {
          beforeEach(() => {
            cy.contains('view').click()
            cy.contains('like').click()
          })

          it('can be liked', () => {
            cy.contains('likes 1')
          })
          
          it.only('orders blogs based on likes', () => {
            cy.contains('create new blog').click()
            cy.get('#title-input').type('second more likes')
            cy.get('#author-input').type('test author')
            cy.get('#url-input').type('test url')
            cy.get('#create-button').click()
            cy.contains('view').click()
            cy.contains('second more likes test author')
              .contains('like')
              .click()
            cy.wait(1000)
            cy.contains('second more likes test author')
              .contains('like')
              .click()

              cy.get('.blog').eq(0).should('contain', 'second more likes')
              cy.get('.blog').eq(1).should('contain', 'test title')
          })
        })

        it('can be deleted by same user', () => {
          cy.contains('view').click()
          cy.contains('remove').click()

          cy.contains('removed by tester')
        })

        it('other user does not have delete button', () => {
          cy.contains('logout').click()
          const imposter = {
            name: 'Testi',
            username: 'imposter',
            password: 'imposter'
          }
          cy.request('POST', 'http://localhost:3003/api/users', imposter)
          cy.get('#username').type('imposter')
          cy.get('#password').type('imposter')
          cy.get('#login-button').click()
          cy.contains('view').click()

          cy.get('.blog').should('not.contain', 'remove')
        })

        
      })
    })

    it('fails with wrong credentials red notification', () => {
      cy.get('#username').type('bla')
      cy.get('#password').type('bla')
      cy.get('#login-button').click()

      cy.contains('invalid username or password')
      cy.get('.notification').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })
})