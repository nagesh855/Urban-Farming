import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import BackButton from '../components/BackButton.jsx'
import { useCommunity } from '../context/hooks.js'

function CommunityPage() {
  const { postId } = useParams()
  const { posts, setPosts } = useCommunity()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [author, setAuthor] = useState('')
  const [error, setError] = useState('')
  const [commentText, setCommentText] = useState('')
  const [commentError, setCommentError] = useState('')
  const post = posts.find(({ id }) => id === postId)

  function createPost(event) {
    event.preventDefault()
    if (author.trim().length < 2 || title.trim().length < 5 || body.trim().length < 10) {
      setError('Enter your name, a title of at least 5 characters, and a post of at least 10 characters.')
      return
    }
    setPosts((current) => [{ id: `post-${Date.now()}`, author: author.trim(), title: title.trim(), body: body.trim(), tag: 'Community', date: 'Just now', likes: 0, comments: [] }, ...current])
    setAuthor('')
    setTitle('')
    setBody('')
    setError('')
  }

  function toggleLike(id) {
    setPosts((current) => current.map((item) => item.id === id ? { ...item, liked: !item.liked, likes: item.likes + (item.liked ? -1 : 1) } : item))
  }

  function addComment(event) {
    event.preventDefault()
    if (commentText.trim().length < 2) {
      setCommentError('Write at least 2 characters before posting a comment.')
      return
    }
    setPosts((current) => current.map((item) => item.id === postId
      ? { ...item, comments: [...item.comments, { id: `comment-${Date.now()}`, author: 'You', text: commentText.trim() }] }
      : item))
    setCommentText('')
    setCommentError('')
  }

  if (postId) {
    if (!post) return <main className="page-content"><BackButton fallback="/community" /><h1>Post not found</h1><Link className="primary-btn" to="/community">Return to community</Link></main>
    return (
      <main className="page-content">
        <BackButton fallback="/community" />
        <article className="post-detail">
          <span className="card-kicker">{post.tag} · {post.date}</span>
          <h1>{post.title}</h1>
          <p className="post-byline">Shared by {post.author}</p>
          <p className="post-body">{post.body}</p>
          <button type="button" className="text-action" aria-pressed={Boolean(post.liked)} onClick={() => toggleLike(post.id)}>{post.liked ? '♥' : '♡'} {post.likes} likes</button>
          <h2>Comments ({post.comments.length})</h2>
          {post.comments.map((comment) => <p className="comment" key={comment.id}><strong>{comment.author}</strong> {comment.text}</p>)}
          <form className="stacked-form comment-form" onSubmit={addComment} noValidate>
            <label htmlFor="comment-text">Add a comment</label>
            <textarea id="comment-text" value={commentText} onChange={(event) => setCommentText(event.target.value)} minLength={2} required />
            {commentError && <p className="form-error" role="alert">{commentError}</p>}
            <button className="small-primary" type="submit">Post comment</button>
          </form>
        </article>
      </main>
    )
  }

  return (
    <main className="page-content">
      <BackButton />
      <div className="page-heading"><div><p className="eyebrow">Neighbors growing together</p><h1>Community Garden</h1><p>Share growing tips, local events, and resources. Posts are saved in this browser only.</p></div></div>
      <div className="community-layout">
        <section className="post-list" aria-label="Community posts">
          {posts.map((item) => (
            <article className="content-card community-card" key={item.id}>
              <span className="card-kicker">{item.tag} · {item.date}</span>
              <h2><Link to={`/community/${item.id}`}>{item.title}</Link></h2>
              <p>{item.body}</p>
              <div className="community-card-actions">
                <span>By {item.author}</span>
                <button type="button" className="text-action" aria-pressed={Boolean(item.liked)} onClick={() => toggleLike(item.id)}>{item.liked ? '♥' : '♡'} {item.likes}</button>
                <Link className="text-action" to={`/community/${item.id}`}>Comment ({item.comments.length})</Link>
              </div>
            </article>
          ))}
          {!posts.length && <p className="empty-state">No community posts yet. Start the conversation.</p>}
        </section>
        <form className="stacked-form content-card create-post-form" onSubmit={createPost} noValidate>
          <h2>Share with the community</h2>
          <label htmlFor="post-author">Your name</label><input id="post-author" value={author} onChange={(event) => setAuthor(event.target.value)} required minLength={2} />
          <label htmlFor="post-title">Post title</label><input id="post-title" value={title} onChange={(event) => setTitle(event.target.value)} required minLength={5} maxLength={100} />
          <label htmlFor="post-body">Your post</label><textarea id="post-body" value={body} onChange={(event) => setBody(event.target.value)} required minLength={10} maxLength={1000} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="primary-btn">Create post</button>
        </form>
      </div>
    </main>
  )
}

export default CommunityPage
