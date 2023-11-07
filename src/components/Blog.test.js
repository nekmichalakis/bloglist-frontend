import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
    const user = {
        username: 'tester'
    }
    const blog = {
        title: 'this is a test',
        author: 'me',
        url: 'blabla',
        likes: 0,
        user: user
    }

    test('renders title author but no url likes', () => {
        const container = render(<Blog blog={blog} user={user} />).container

        const titleAuthor = screen.getByText('this is a test me')
        expect(titleAuthor).toBeDefined()

        const div = container.querySelector('.urlLikes')
        expect(div).toHaveStyle('display: none')
    })

    test('url and likes shown when button clicked', async () => {
        const container = render(<Blog blog={blog} user={user} />).container

        const mockUser = userEvent.setup()
        const button = screen.getByText('view')
        await mockUser.click(button)

        const div = container.querySelector('.urlLikes')
        expect(div).not.toHaveStyle('display: none')

        const urlLikes = screen.getByText('blabla')
        expect(urlLikes).toBeDefined()
    })

    test('when like button clicked twice, two handler calls', async () => {
        const mockHandler = jest.fn()
        render(<Blog blog={blog} user={user} addLike={mockHandler} />)

        const mockUser = userEvent.setup()
        const button = screen.getByText('view')
        await mockUser.click(button)
        const likeButton = screen.getByText('like')
        await mockUser.click(likeButton)
        await mockUser.click(likeButton)

        expect(mockHandler.mock.calls).toHaveLength(2)
    })
})