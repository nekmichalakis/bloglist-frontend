import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const BlogList = () => {
    const blogs = useSelector(state => state.blogs)
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes) //try to put it in useSelector ?

    const navigate = useNavigate()

    return (
        <div>
          <button onClick={() => navigate('/createBlog')}>create new blog</button>
            {sortedBlogs.map(blog =>
            <div key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </div>
          )}
        </div>
    )

}

export default BlogList